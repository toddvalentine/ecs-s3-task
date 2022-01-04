import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as golambda from '@aws-cdk/aws-lambda-go-alpha';
import { Construct } from 'constructs';

export class Function extends golambda.GoFunction {
    constructor(scope: Construct, id: string, props: golambda.GoFunctionProps) {
        props = {
            architecture: lambda.Architecture.ARM_64,
            bundling: {
                goBuildFlags: ["-tags lambda.norpc"],
                environment: {
                    GOARCH: "arm64",
                },
            },
            ...props
        };
        super(scope, id, props);
    }
}