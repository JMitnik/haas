import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as secretsmanager from "@aws-cdk/aws-secretsmanager";
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns';

import { Construct, DefaultStackSynthesizer, SecretValue, Stack, StackProps } from '@aws-cdk/core';
import { CdkPipeline, SimpleSynthAction } from "@aws-cdk/pipelines";

interface MainPipelineStackProps extends StackProps {
  apiService: ecs_patterns.ApplicationLoadBalancedFargateService;
  dbUrl: string;
  vpc: ec2.Vpc;
}

export class MainPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: MainPipelineStackProps) {
    super(scope, id, props);

    // Define artifacts where the checkout output will be
    const sourceArtifact = new codepipeline.Artifact();
    const buildArtifact = new codepipeline.Artifact();
    const cdkOutputArtifact = new codepipeline.Artifact();

    const pipeline = new CdkPipeline(this, 'HaasPipeline', {
      pipelineName: 'HaasPipeline',
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
        actionName: 'HAASCfnSynth',
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

    const repository = new ecr.Repository(this, 'HaasRepo', {
      repositoryName: 'haas_service_repo',
    });

    const buildRole = new iam.Role(this, 'BuildRole', {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
    });
    repository.grantPullPush(buildRole);

    const buildStage = pipeline.addStage('build');
    buildStage.addActions(new codepipeline_actions.CodeBuildAction({
      actionName: 'DockerBuild',
      input: sourceArtifact,
      outputs: [buildArtifact],
      project: new codebuild.PipelineProject(this, 'Docker', {
        environmentVariables: {
          IMAGE_REPO_NAME: { value: 'haas_service_repo' },
          IMAGE_TAG: { value: 'latest' },
          AWS_ACCOUNT_ID: { value: '649621042808' },
          AWS_DEFAULT_REGION: { value: 'eu-central-1' },
        },
        environment: {
          privileged: true
        },
        buildSpec: codebuild.BuildSpec.fromObject({
          version: '0.2',
          phases: {
            pre_build: {
              commands: [
                'echo Logging in to AWS',
                '$(aws ecr get-login --region $AWS_DEFAULT_REGION --no-include-email)'
              ]
            },
            build: {
              commands: [
                'echo Build started',
                'echo Building the Docker image...',
                'docker build -t $IMAGE_REPO_NAME:$IMAGE_TAG ./api',
                'docker tag $IMAGE_REPO_NAME:$IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$IMAGE_TAG'
              ]
            },
            post_build: {
              commands: [
                'echo finishing up',
                'docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$IMAGE_TAG',
                'echo finished pushing docker image'
              ]
            }
          }
        }),
        role: buildRole,
      }),
    }));

    const migrateStage = pipeline.addStage('Migrate');
    migrateStage.addActions(new codepipeline_actions.CodeBuildAction({
      actionName: 'Migrate',
      input: sourceArtifact,
      project: new codebuild.PipelineProject(this, 'Migrate', {
        buildSpec: codebuild.BuildSpec.fromSourceFilename('./migrate-build-spec.yml'),
        vpc: props?.vpc,
        subnetSelection: {
          subnetType: ec2.SubnetType.PUBLIC
        }
      }),
      environmentVariables: {
        DB_STRING: {
          value: 'API_RDS_String',
          type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER
        }
      },
    }));

    if (!props?.apiService.service) return;

    const deployStage = pipeline.addStage('Deploy');
    deployStage.addActions(new codepipeline_actions.EcsDeployAction({
      service: props?.apiService.service,
      actionName: 'Deploy',
      input: buildArtifact,
    }));
  }
}