# Deploy lambda delivery-stream
(cd ../src/lambdas/delivery-stream && sam deploy --no-confirm-changeset --profile haas-prod)

(cd ../stack && cdk deploy HAASCampaign --profile haas-prod)
