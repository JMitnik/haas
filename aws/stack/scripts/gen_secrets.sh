# NOTE: This only works if the JWT secret has not been set yet.
read -p "This will set the JWT and API secret in the environment. Are you sure you wish to continue? (yes/no)"
if [ "$REPLY" != "yes" ]; then
  exit
fi

# TODO: Think of a better way
JWT_SECRET=$(date +%s | sha256sum | base64 | head -c 32 ; echo)
API_SECRET=$(date +%s | sha256sum | base64 | head -c 32 ; echo)
JWT_SECRET_NAME="JWT_SECRET"
API_SECRET_NAME="API_SECRET"

REGION="eu-central-1"

aws secretsmanager create-secret --name $JWT_SECRET_NAME --secret-string $JWT_SECRET --region $REGION  --profile haas-staging
aws secretsmanager create-secret --name $API_SECRET_NAME --secret-string $API_SECRET --region $REGION  --profile haas-staging
