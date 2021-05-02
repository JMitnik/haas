#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CampaignService } from '../lib/campaign-service/campaign-service';

const app = new cdk.App();

// Campaign stack (deploy this with `-c stage=dev`)
const campaign = new CampaignService(app, 'haas-campaign-dev');