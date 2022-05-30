import { aws_ecr as ecr, aws_ecs_patterns as aws_ecs_patterns } from "aws-cdk-lib";
import { Construct } from 'constructs';

interface CoreRepoProps {
  repoName: string;
}

export class CoreRepo extends Construct {
  repo: ecr.Repository;

  constructor(scope: Construct, id: string, props: CoreRepoProps) {
    super(scope, id);

    const repo = new ecr.Repository(this, 'CORE_REPO', {
      repositoryName: props.repoName,
    });

    this.repo = repo;
  }
}
