#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { HaasCampaignStack } from '../lib/campaign-service/campaign-stack';

const app = new cdk.App();

// Campaign stack
const campaign = new HaasCampaignStack(app, 'haas-campaign-dev');