import { Stack, StackProps } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class VtypeioEcsS3TaskStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceBucket = new s3.Bucket(this, 'sourceBucket', {
      encryption: s3.BucketEncryption.KMS_MANAGED,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
    });

    const vpc = new ec2.Vpc(this, 'taskVpc', {
      maxAzs: 2,
      // TODO: review if we need nat gateway/private subnets
      natGateways: 0
    });

    const cluster = new ecs.Cluster(this, 'ecsCluster', {
      vpc: vpc
    });

    const ter = new iam.Role(this, 'taskExecutionRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com')
    });
    ter.addToPolicy(new iam.PolicyStatement({
      actions: ['ecr:BatchCheckLayerAvailability', 'ecr:GetDownloadUrlForLayer', 'ecr:BatchGetImage', 'log:CreateLogStream', 'logs:PutLogEvents', 'ecr:GetAuthorizationToken'],
      resources: ['*']
    }));

    const tr = new iam.Role(this, 'taskRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com')
    });
    tr.addToPolicy(new iam.PolicyStatement({
      actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
      resources: ['*']
    }));
    sourceBucket.grantRead(tr)

  }
}
