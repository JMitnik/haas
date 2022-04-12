bash push_ecr.sh

# TODO: Fetch
CLUSTER_NAME="CORE_CLUSTER"
SERVICE_NAME="StagingCoreTemp-COREAPIAPISERVICEServiceBA2271D8-IsUSGTyhOoQ2"

aws ecs update-service \
  --cluster $CLUSTER_NAME \
  --service $SERVICE_NAME \
  --force-new-deployment \
  --profile haas-staging \
  --region eu-central-1
