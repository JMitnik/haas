import { aws_ecr as ecr, aws_ecs_patterns as aws_ecs_patterns } from "aws-cdk-lib";
import { IRepository } from "aws-cdk-lib/aws-ecr";
import { Construct } from 'constructs';

interface CoreRepoProps {
  repoName: string;
}

export class CoreRepo extends Construct {
  repo: IRepository;

  constructor(scope: Construct, id: string, props: CoreRepoProps) {
    super(scope, id);
    // TODO: Repo now has to be created before-hand.
    const repo = ecr.Repository.fromRepositoryName(this, 'CORE_REPO', props.repoName);

    this.repo = repo;
  }
}
