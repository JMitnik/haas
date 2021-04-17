import { expect as expectCDK, countResources } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Stack from '../lib/main-stack';

test('Empty Stack', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Stack.APIStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(countResources('AWS::EC2::VPC', 1));
});
