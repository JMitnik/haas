# TODO: Check IAM permissions
# TODO: Chcek environment, this should not be possible in prod (unless the Master account is used)
read -p "This will deploy the latest Docker container to the ECR. Are you sure you wish to continue? (yes/no) "
if [ "$REPLY" != "yes" ]; then
  echo "Understandable, have a good day."
  exit
fi

# TODO: Replace haas-staging with args flag
AWS_ACCOUNT_ID="$(aws sts get-caller-identity --query 'Account' --output text --profile haas-staging)"
REGION="eu-central-1"

LOCAL_REPO_NAME="haas"
LOCAL_TAG="local-ecr"

REMOTE_REPO_NAME="haas_core_repo"
REMOTE_REPO_TAG="latest"

# Region is a variable
# aws_account_id is a variable
docker build -t $LOCAL_REPO_NAME:$LOCAL_TAG api

# # Authenticate our docker client with the aws ECR
aws ecr get-login-password --region $REGION --profile haas-staging | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# # Tag our (local) image
docker tag $LOCAL_REPO_NAME:$LOCAL_TAG $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REMOTE_REPO_NAME:$REMOTE_REPO_TAG

# # Push the (local) image
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REMOTE_REPO_NAME:$REMOTE_REPO_TAG
