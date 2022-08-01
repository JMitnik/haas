set -e

read -p "This will build an image from your LOCAL environment, push it to ECR, and update the ECS cluster. Are you sure you wish to continue? (yes/no) "
if [ "$REPLY" != "yes" ]; then
  echo "Understandable, have a good day."
  exit
fi

DIR="$(dirname "$(realpath "$0")")"
push_file="$DIR/push-ecr-staging.sh"

bash "$push_file"

# # TODO: Fetch
CLUSTER_NAME="CORE_CLUSTER"
SERVICE_NAME="StagingCoreTemp-COREAPIAPISERVICEServiceBA2271D8-IsUSGTyhOoQ2"

aws ecs update-service \
  --cluster $CLUSTER_NAME \
  --service $SERVICE_NAME \
  --force-new-deployment \
  --profile haas-staging \
  --region eu-central-1
