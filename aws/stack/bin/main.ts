#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { APIStack } from '../lib/main-stack';
import { MainPipelineStack } from '../lib/pipeline/main-pipeline-stack';
import { HaasCampaignStack } from '../lib/stacks/campaign-stack';
import { InternalNotifyStack } from '../lib/stacks/Internal/InternalNotifyStack';

const app = new cdk.App();

// Main stack and pipeline
const api = new APIStack(app, 'HaasAPIMainStack');
const pipeline = new MainPipelineStack(app, 'haasSvcPipeline', {
    prefix: 'haas_svc_api',
    apiService: api.apiService,
    dbUrl: api.dbUrl,
    vpc: api.vpc,
    rdsPassword: api.rdsPassword,
    db: api.db,
    rdsSecurityGroup: api.rdsSecurityGroup
});

// // Campaign stack
const campaign = new HaasCampaignStack(app, 'HAASCampaign', {
  accountId: '649621042808'
});

// // Internal stack
const internalStack = new InternalNotifyStack(app, 'InternalNotifyStack', {
  accountId: '649621042808',
  secretSlackKey: 'internal/SLACK_URL'
});
