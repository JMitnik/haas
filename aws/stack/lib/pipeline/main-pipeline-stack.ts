import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as ecr from '@aws-cdk/aws-ecr';
import * as iam from '@aws-cdk/aws-iam';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { Construct, DefaultStackSynthesizer, SecretValue, Stack, StackProps } from '@aws-cdk/core';
import { CdkPipeline, SimpleSynthAction } from "@aws-cdk/pipelines";

export class MainPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // Define artifacts where the checkout output will be
        const sourceArtifact = new codepipeline.Artifact();
        const cdkOutputArtifact = new codepipeline.Artifact();

        const pipeline = new CdkPipeline(this, 'MainPipeline', {
            pipelineName: 'HAASMainCDKPipeline',
            cloudAssemblyArtifact: cdkOutputArtifact,
            sourceAction: new codepipeline_actions.GitHubSourceAction({
                actionName: 'Github',
                output: sourceArtifact,
                oauthToken: SecretValue.secretsManager('GithubAuth'),
                owner: 'jmitnik',
                repo: 'haas'
            }),

            synthAction: SimpleSynthAction.standardYarnSynth({
                sourceArtifact,
                cloudAssemblyArtifact: cdkOutputArtifact,
                buildCommand: 'yarn build'
            })
        });

        const repository = new ecr.Repository(this, 'HAASMainRepository', {
            repositoryName: 'HaasMainRepository'
        });

        const buildRole = new iam.Role(this, 'DockerBuildRole', {
            assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
        });
        repository.grantPullPush(buildRole);

        const buildStage = pipeline.addStage('AppBuilding');
        buildStage.addActions(new codepipeline_actions.CodeBuildAction({
            actionName: 'DockerBuild',
            input: sourceArtifact,
            project: new codebuild.Project(this, 'DockerBuild', {
                role: buildRole,
                buildSpec: 
            }),
        }))
    }
}