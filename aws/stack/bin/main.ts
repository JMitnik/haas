#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { APIStack } from '../lib/main-stack';
import { MainPipelineStack } from '../lib/pipeline/main-pipeline-stack';

const app = new cdk.App();
const api = new APIStack(app, 'HaasAPIMainStack');
const pipeline = new MainPipelineStack(app, 'HaasPipeline', {
    apiService: api.apiService,
    dbUrl: api.dbUrl,
    vpc: api.vpc
});
