#!/usr/bin/env node
import 'source-map-support/register';
import { App, Aws } from 'aws-cdk-lib';
import { APIStack } from '../lib/main-stack';
import { MainPipelineStack } from '../lib/pipeline/main-pipeline-stack';
import { HaasCampaignStack } from '../lib/stacks/campaign-stack';
import { InternalNotifyStack } from '../lib/stacks/Internal/InternalNotifyStack';
import { CoreFixed } from '../lib/stacks/Core/CoreFixed';
import { CoreTempStack } from '../lib/stacks/Core/CoreTempStack';
import { prodVariables, stagingVariables } from '../lib/stacks/Core/CoreVariables';

const app = new App();

const stagingEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
}

const prodEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
}

// Main stack and pipeline for Staging
const stagingCoreFixed = new CoreFixed(app, 'StagingCoreFixed', { env: stagingEnv, variables: stagingVariables });
const stagingCoreTemp = new CoreTempStack(app, 'StagingCoreTemp', {
  vpc: stagingCoreFixed.vpc.vpc,
  db: stagingCoreFixed.db.rdsDb,
  repo: stagingCoreFixed.repo.repo,
  dbSecurityGroup: stagingCoreFixed.db.dbSecurityGroup,
  env: stagingEnv,
  variables: stagingVariables,
});

// Main stack and pipeline for Prod
const prodCoreFixed = new CoreFixed(app, 'ProdCoreFixed', { env: prodEnv, variables: prodVariables });
const prodCoreTemp = new CoreTempStack(app, 'ProdCoreTemp', {
  vpc: prodCoreFixed.vpc.vpc,
  db: prodCoreFixed.db.rdsDb,
  repo: prodCoreFixed.repo.repo,
  dbSecurityGroup: prodCoreFixed.db.dbSecurityGroup,
  env: prodEnv,
  variables: prodVariables
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
