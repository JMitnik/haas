import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as rds from '@aws-cdk/aws-rds';
import * as iam from '@aws-cdk/aws-iam';
import * as secretsmanager from "@aws-cdk/aws-secretsmanager";
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns';

import { Construct, DefaultStackSynthesizer, SecretValue, Stack, StackProps } from '@aws-cdk/core';
import { CdkPipeline, SimpleSynthAction } from "@aws-cdk/pipelines";

interface MainPipelineStackProps extends StackProps {
  apiService: ecs_patterns.ApplicationLoadBalancedFargateService;
  prefix: string;
  dbUrl: string;
  vpc: ec2.Vpc;
  db: rds.DatabaseInstance;
}

export class MainPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: MainPipelineStackProps) {
    super(scope, id, props);

    // Define artifacts where the checkout output will be
    const sourceArtifact = new codepipeline.Artifact();
    const buildArtifact = new codepipeline.Artifact();
    const cdkOutputArtifact = new codepipeline.Artifact();

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
        branch: 'feat/deployment-asw',
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

    const repoName = `${props?.prefix}_service_repo`;
    const repository = new ecr.Repository(this, `${props?.prefix}Repo`, { repositoryName: repoName });

    const baseRepo = ecr.Repository.fromRepositoryName(this, 'BaseRepo', 'node-base');

    const migrationRepoName = 'haas-migrations';
    const migrationRepo = ecr.Repository.fromRepositoryName(this, 'MigrationRepo', migrationRepoName);

    const buildRole = new iam.Role(this, `${props?.prefix}BuildRole`, {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
    });
    baseRepo.grantPullPush(buildRole);
    repository.grantPullPush(buildRole);

    const buildStage = pipeline.addStage('build');
    buildStage.addActions(new codepipeline_actions.CodeBuildAction({
      actionName: `${props?.prefix}DockerBuild`,
      input: sourceArtifact,
      outputs: [buildArtifact],
      project: new codebuild.PipelineProject(this, `${props?.prefix}DockerBuild`, {
        environmentVariables: {
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
                'docker tag $MIRATE_REPO_NAME:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$MIRATE_REPO_NAME:latest'
              ]
            },
            post_build: {
              commands: [
                'echo finishing up',
                'docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$CODEBUILD_RESOLVED_SOURCE_VERSION',
                'docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$MIRATE_REPO_NAME:latest',
                'echo finished pushing docker image',
                `printf '{ "name": "haas-api", "imageUri": "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$CODEBUILD_RESOLVED_SOURCE_VERSION" }' > imagedefinitions.json`,
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

    const migrateRole = new iam.Role(this, `${props?.prefix}MigrateRole`, {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
    });

    const secret = secretsmanager.Secret.fromSecretNameV2(this, 'API_RDS_String', 'API_RDS_String');
    secret.grantRead(migrateRole);

    const migrateArtifact = new codepipeline.Artifact('migrateArtifact');

    const migrateStage = pipeline.addStage(`${props?.prefix}MigrateBuild`);
    migrateStage.addActions(new codepipeline_actions.CodeBuildAction({
      actionName: `${props?.prefix}MigrateBuild`,
      input: sourceArtifact,
      outputs: [migrateArtifact],
      project: new codebuild.PipelineProject(this, `${props?.prefix}MigrateBuild`, {
        buildSpec: codebuild.BuildSpec.fromObject({
          version: '0.2',
          phases: {
            pre_build: {
              commands: [
                'cd api'
              ]
            },
            build: {
              commands: [
                'echo $CODEBUILD_SRC_DIR > codebuildsrcdir.txt',
                'pwd > whereami.txt',
                'ls > whatsaroundme.txt',
                'npx prisma migrate up --experimental 2> error.txt',
              ]
            }
          },
          artifacts: {
            files: [
              'api/codebuildsrcdir.txt',
              'api/whereami.txt',
              'api/whatsaroundme.txt',
              'api/error.txt'
            ]
          }
        }),
        environment: {
          buildImage: codebuild.LinuxBuildImage.fromEcrRepository(migrationRepo),
          privileged: true
        },
        vpc: props?.vpc,
        subnetSelection: {
          subnetType: ec2.SubnetType.ISOLATED
        },
        role: migrateRole
      }),
      environmentVariables: {
        DB_STRING: {
          value: 'API_RDS_String',
          type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER
        }
      },
    }));

    props?.db.grantConnect(migrateRole);

    if (!props?.apiService.service) return;

    const deployStage = pipeline.addStage(`${props?.prefix}Deploy`);
    deployStage.addActions(new codepipeline_actions.EcsDeployAction({
      service: props?.apiService.service,
      actionName: `${props?.prefix}Deploy`,
      input: buildArtifact,
    }));
  }
}