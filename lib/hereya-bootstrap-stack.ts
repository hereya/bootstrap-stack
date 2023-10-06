import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { CfnOutput } from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as iam from 'aws-cdk-lib/aws-iam';

export class HereyaBootstrapStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const table = new dynamodb.Table(this, 'hereyaTable', {
            tableName: 'hereya',
            partitionKey: {
                name: 'collection',  // Collection name: workspace, project
                type: dynamodb.AttributeType.STRING,  // Type of the attribute
            },
            sortKey: {
                name: 'name', // Name of the item: workspace name, project name
                type: dynamodb.AttributeType.STRING,  // Type of the attribute
            },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,  // Use on-demand billing mode
            removalPolicy: cdk.RemovalPolicy.DESTROY, // Automatically destroy the table when the stack is deleted
        });

        new CfnOutput(this, 'dynamoDbTableName', {
            value: table.tableName,
            description: 'The name of the DynamoDB table',
        })

        const project = new codebuild.Project(this, 'hereyaCdk', {
            projectName: 'hereyaCdk',
            environment: {
                buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
            },
            buildSpec: codebuild.BuildSpec.fromObject({
                version: '0.2',
                env: {
                    shell: 'bash',
                },
                phases: {
                    install: {
                        'runtime-versions': {
                            nodejs: '18.x',
                        },
                        commands: [
                            'echo "TODO: install hereya cli here"',
                        ],
                    },
                    pre_build: {
                        commands: [
                            'echo "TODO: clone package repo here and check input parameters"',
                        ],
                    },
                    build: {
                        commands: [
                            'echo "TODO: go to package folder and run hereya aws deploy here"',
                        ],
                    },
                },
            }),
        });
        // Add permissions to the project's role
        project.role?.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));

        new CfnOutput(this, 'cdkCodebuildProjectName', {
            value: project.projectName,
            description: 'The name of the CodeBuild project for CDK deployment',
        })
    }
}
