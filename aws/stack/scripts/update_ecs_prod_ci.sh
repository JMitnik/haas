set -e

echo "This will build an image from your LOCAL environment, push it to ECR, and update the ECS cluster."
DIR="$(dirname "$(realpath "$0")")"
push_file="$DIR/push-ecr-prod-ci.sh"

bash "$push_file"

echo "Updating ECS Cluster."

# # TODO: Fetch
CLUSTER_NAME="CORE_CLUSTER"
SERVICE_NAME="ProdCoreTemp-COREAPIAPISERVICEServiceBA2271D8-0Kk4hvIJx9bx"

aws ecs update-service \
  --cluster $CLUSTER_NAME \
  --service $SERVICE_NAME \
  --force-new-deployment

echo "Update ended."
