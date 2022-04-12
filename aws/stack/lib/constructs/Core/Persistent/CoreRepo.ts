import { Construct } from 'constructs';
import { Stack, aws_ecr as ecr, aws_ecs_patterns as aws_ecs_patterns } from "aws-cdk-lib";

interface CoreRepoProps {
  repoName: string;
}

export class CoreRepo extends Stack {
  repo: ecr.Repository;

  constructor(scope: Construct, id: string, props: CoreRepoProps) {
    super(scope, id);

    this.repo = new ecr.Repository(this, 'CORE_REPO', {
      repositoryName: props.repoName,
    });
  }
}
