echo "1/X: Fetching instance of Bastion"

BASTION_INSTANCE_ID="$(aws ec2 describe-instances \
                          --region="eu-central-1" \
                          --filter "Name=tag:Name,Values=BastionHost" \
                          --query "Reservations[].Instances[?State.Name == 'running'].InstanceId[]" \
                          --output text \
                          --profile haas-staging)"

echo "2/X: 'Generating temporary public SSH key'"

echo $(cd /tmp && ssh-keygen -t rsa -N "" -f /tmp/rds_rsa <<< n)

echo "3/X: Sending public SSH key to EC2 using ec2-instance-connect"
echo $(aws ec2-instance-connect send-ssh-public-key --instance-id "$BASTION_INSTANCE_ID" --region "eu-central-1" --availability-zone "eu-central-1a" --instance-os-user "ec2-user" --profile "haas-staging" --ssh-public-key "file:///tmp/rds_rsa.pub")

echo "4/X: Connecting to EC2 now"
aws ssm start-session \
  --target=$BASTION_INSTANCE_ID \
  --region=eu-central-1 \
  --profile haas-staging
  --document-name AWS-StartPortForwardingSession \
  --parameters '{"portNumber":["22"], "localPortNumber":["9999"]}' \
