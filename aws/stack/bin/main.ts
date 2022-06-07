#!/usr/bin/env node
import 'source-map-support/register';
import { App, Aws } from 'aws-cdk-lib';
import { APIStack } from '../lib/main-stack';
import { MainPipelineStack } from '../lib/pipeline/main-pipeline-stack';
import { HaasCampaignStack } from '../lib/stacks/campaign-stack';
import { InternalNotifyStack } from '../lib/stacks/Internal/InternalNotifyStack';
import { StagingCoreFixed } from '../lib/stacks/Core/StagingCoreFixed';
import { StagingCoreTemp } from '../lib/stacks/Core/StagingCoreTemp';
import { StagingAutomations } from '../lib/stacks/Core/StagingAutomations';

const app = new App();

const stagingEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
}

console.log(stagingEnv);

// Main stack and pipeline
const api = new APIStack(app, 'HaasAPIMainStack');
const stagingCoreFixed = new StagingCoreFixed(app, 'StagingCoreFixed', { env: stagingEnv });
const stagingCoreTemp = new StagingCoreTemp(app, 'StagingCoreTemp', {
  vpc: stagingCoreFixed.vpc.vpc,
  db: stagingCoreFixed.db.rdsDb,
  repo: stagingCoreFixed.repo.repo,
  dbSecurityGroup: stagingCoreFixed.db.dbSecurityGroup,
  env: stagingEnv,
});

const stagingAutomations = new StagingAutomations(app, 'StagingAutomations', {
  vpc: stagingCoreFixed.vpc.vpc,
  db: stagingCoreFixed.db.rdsDb,
  repo: stagingCoreFixed.repo.repo,
  dbSecurityGroup: stagingCoreFixed.db.dbSecurityGroup,
  env: stagingEnv,
});

// const pipeline = new MainPipelineStack(app, 'haasSvcPipeline', {
//     prefix: 'haas_svc_api',
//     apiService: api.apiService,
//     dbUrl: api.dbUrl,
//     vpc: api.vpc,
//     rdsPassword: api.rdsPassword,
//     db: api.db,
//     rdsSecurityGroup: api.rdsSecurityGroup
// });

// // // Campaign stack
// const campaign = new HaasCampaignStack(app, 'HAASCampaign', {
//   accountId: '649621042808'
// });

// // // Internal stack
// const internalStack = new InternalNotifyStack(app, 'InternalNotifyStack', {
//   accountId: '649621042808',
//   secretSlackKey: 'internal/SLACK_URL'
// });
