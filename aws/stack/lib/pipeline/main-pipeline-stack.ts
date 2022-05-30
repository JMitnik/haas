import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as rds from '@aws-cdk/aws-rds';
import * as iam from '@aws-cdk/aws-iam';
import * as secretsmanager from "@aws-cdk/aws-secretsmanager";
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns';
import { App, Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core';
import { CdkPipeline, SimpleSynthAction } from "@aws-cdk/pipelines";

interface MainPipelineStackProps extends StackProps {
  apiService: ecs_patterns.ApplicationLoadBalancedFargateService;
  prefix: string;
  dbUrl: string;
  vpc: ec2.Vpc;
  db: rds.DatabaseInstance;
  rdsPassword: secretsmanager.Secret;
  rdsSecurityGroup: ec2.SecurityGroup;
}

export class MainPipelineStack extends Stack {
  constructor(scope: App, id: string, props?: MainPipelineStackProps) {
    super(scope, id, props);

    // Define artifacts where the checkout output will be
    const sourceArtifact = new codepipeline.Artifact();
    const buildArtifact = new codepipeline.Artifact();
    const cdkOutputArtifact = new codepipeline.Artifact();

    /**
     * Step 1: Define the pipeline, as well as how to create the
     * cloudformation to transform this CDK code.
     */
    const pipeline = new CdkPipeline(this, `${props?.prefix}Pipeline`, {
      pipelineName: `${props?.prefix}Pipeline`,
      cloudAssemblyArtifact: cdkOutputArtifact,
      selfMutating: false,
      sourceAction: new codepipeline_actions.GitHubSourceAction({
        actionName: 'Github',
        trigger: codepipeline_actions.GitHubTrigger.WEBHOOK,
        output: sourceArtifact,
        oauthToken: SecretValue.secretsManager('GithubAuth', { jsonField: 'GITHUB_AUTH' }),
        owner: 'JMitnik',
        branch: 'master',
        repo: 'haas'
      }),

      synthAction: SimpleSynthAction.standardYarnSynth({
        sourceArtifact,
        actionName: `${props?.prefix}CfnSynth`,
        subdirectory: 'aws/stack',
        cloudAssemblyArtifact: cdkOutputArtifact,
      })
    });

    pipeline.codePipeline.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'ecr:DescribeRepositories'
      ],
      resources: ['*']
    }))

    // The repository of the main code
    const repoName = `haas-svc-api`;
    const repository = ecr.Repository.fromRepositoryName(this, 'ServiceRepo', repoName);

    // The repository with our custom base image (this is necssary because DockerHub rate-limits)
    const baseRepo = ecr.Repository.fromRepositoryName(this, 'BaseRepo', 'node-base');

    // The repository containing our migrations (used in migration builds).
    const migrationRepoName = 'haas-migrations';
    const migrationRepo = ecr.Repository.fromRepositoryName(this, 'MigrationRepo', migrationRepoName);

    /**
     * Step 2: Build
     */
    const buildRole = new iam.Role(this, `${props?.prefix}BuildRole`, {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
    });
    baseRepo.grantPullPush(buildRole);
    migrationRepo.grantPullPush(buildRole);
    repository.grantPullPush(buildRole);

    const buildStage = pipeline.addStage('build');
    buildStage.addActions(new codepipeline_actions.CodeBuildAction({
      actionName: `${props?.prefix}DockerBuild`,
      input: sourceArtifact,
      outputs: [buildArtifact],
      // The build will create an envrionment and
      // - Create a production-ready build (new tag and latest with an imagedefinitions.json for the deployment).
      // - Create a migration-container containing the latest changes and prisma.
      //      This is necssary as the codebuild is mostly private and has no access to npm.

      project: new codebuild.PipelineProject(this, `${props?.prefix}DockerBuild`, {
        environmentVariables: {
          HAAS_SERVICE_NAME: { value: props?.apiService.service.taskDefinition.defaultContainer?.containerName },
          IMAGE_REPO_NAME: { value: repoName },
          MIRATE_REPO_NAME: { value: migrationRepoName },
          IMAGE_TAG: { value: 'latest' },
          AWS_ACCOUNT_ID: { value: '649621042808' },
          AWS_DEFAULT_REGION: { value: 'eu-central-1' },
        },
        environment: {
          privileged: true,
          buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3
        },
        buildSpec: codebuild.BuildSpec.fromObject({
          version: '0.2',
          phases: {
            pre_build: {
              commands: [
                'echo Logging in to AWS',
                '$(aws ecr get-login --region $AWS_DEFAULT_REGION --no-include-email)',
                'aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com'
              ]
            },
            build: {
              commands: [
                'echo Build started',
                'echo Building the Docker image...',
                'docker build -t $IMAGE_REPO_NAME:$CODEBUILD_RESOLVED_SOURCE_VERSION ./api',
                'docker build -t $MIRATE_REPO_NAME:latest --target migrateBuilder ./api',
                'docker tag $IMAGE_REPO_NAME:$CODEBUILD_RESOLVED_SOURCE_VERSION $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$CODEBUILD_RESOLVED_SOURCE_VERSION',
                'docker tag $IMAGE_REPO_NAME:$CODEBUILD_RESOLVED_SOURCE_VERSION $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:latest',
                'docker tag $MIRATE_REPO_NAME:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$MIRATE_REPO_NAME:latest'
              ]
            },
            post_build: {
              commands: [
                'echo finishing up',
                'docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$CODEBUILD_RESOLVED_SOURCE_VERSION',
                'docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:latest',
                'docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$MIRATE_REPO_NAME:latest',
                'echo finished pushing docker image',
                `printf '[{"name":"%s","imageUri":"%s"}]'  $HAAS_SERVICE_NAME  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$CODEBUILD_RESOLVED_SOURCE_VERSION > imagedefinitions.json`,
              ]
            }
          },
          artifacts: {
            files: [
              'imagedefinitions.json'
            ]
          }
        }),
        role: buildRole,
      }),
    }));

    /**
     * Step 3: Migrations
     */
    const migrateRole = new iam.Role(this, `${props?.prefix}MigrateRole`, {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
    });

    // Our migration step needs DB-access.
    const secret = secretsmanager.Secret.fromSecretNameV2(this, 'API_RDS_String', 'API_RDS_String');
    secret.grantRead(migrateRole);

    const migrateArtifact = new codepipeline.Artifact('migrateArtifact');
    migrationRepo.grantPull(migrateRole);

    const migrateStage = pipeline.addStage(`${props?.prefix}MigrateBuild`);

    const migrateBuildProject = new codebuild.PipelineProject(this, `${props?.prefix}MigrateBuild`, {
      // This build will call prisma's migration function, and output it to `output.txt` in the artifact.
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          pre_build: {
            commands: [
              'cd /app'
            ]
          },
          build: {
            commands: [
              'echo $CODEBUILD_SRC_DIR > codebuildsrcdir.txt',
              'pwd > whereami.txt',
              'ls > whatsaroundme.txt',
              './node_modules/.bin/prisma migrate deploy --schema ./schema.prisma > output.txt 2>&1',
            ]
          }
        },
        artifacts: {
          files: [
            '/app/codebuildsrcdir.txt',
            '/app/whereami.txt',
            '/app/whatsaroundme.txt',
            '/app/output.txt'
          ]
        }
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.fromEcrRepository(migrationRepo),
        privileged: true,
        environmentVariables: {
          DB_STRING: {
            value: `${secret.secretName}:url`,
            type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER
          },
        }
      },
      vpc: props?.vpc,
      subnetSelection: {
        subnetType: ec2.SubnetType.ISOLATED
      },
      role: migrateRole,
      securityGroups: props?.rdsSecurityGroup ? [props?.rdsSecurityGroup] : undefined
    });

    migrateBuildProject.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'secretsmanager:GetRandomPassword',
          'secretsmanager:GetResourcePolicy',
          'secretsmanager:GetSecretValue',
          'secretsmanager:DescribeSecret',
          'secretsmanager:ListSecretVersionIds',
        ],
        // TODO: Remove this and replace with appropriate resource
        resources: ['*'],
      })
    )
    props?.db.grantConnect(migrateRole);

    migrateStage.addActions(new codepipeline_actions.CodeBuildAction({
      actionName: `${props?.prefix}MigrateBuild`,
      input: sourceArtifact,
      outputs: [migrateArtifact],
      project: migrateBuildProject
    }));


    if (!props?.apiService.service) return;

    /**
     * Step 5: Deploy
     * Uses the `imagedefinitions.json` from the buildArtifcat to know "what" to deploy.
     */
    const deployStage = pipeline.addStage(`${props?.prefix}Deploy`);
    const deployAction = new codepipeline_actions.EcsDeployAction({
      service: props?.apiService.service,
      actionName: `${props?.prefix}Deploy`,
      input: buildArtifact,
    });
    deployStage.addActions(deployAction);
  }
}
