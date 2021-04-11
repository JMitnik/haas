#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { HaasCampaignStack } from '../lib/stacks/campaign-stack';

const app = new cdk.App();
const haasCampaign = new HaasCampaignStack(app, 'HAASCampaign');
