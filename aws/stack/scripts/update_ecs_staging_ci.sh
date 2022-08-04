set -e

echo "This will build an image from your LOCAL environment, push it to ECR, and update the ECS cluster"

DIR="$(dirname "$(realpath "$0")")"
push_file="$DIR/push-ecr-staging-ci.sh"

bash "$push_file"

# # TODO: Fetch
CLUSTER_NAME="CORE_CLUSTER"
SERVICE_NAME="StagingCoreTemp-COREAPIAPISERVICEServiceBA2271D8-IsUSGTyhOoQ2"

aws ecs update-service \
  --cluster $CLUSTER_NAME \
  --service $SERVICE_NAME \
  --force-new-deployment
