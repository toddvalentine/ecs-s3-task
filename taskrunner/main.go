package main

import (
	"context"
	"os"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"go.uber.org/zap"
)

type config struct {
	ClusterARN        string
	ContainerName     string
	TaskDefinitionARN string
	Subnets           []string
	S3Bucket          string
	IsValid           bool
}

var logger *zap.Logger
var c config

func main() {
	var err error
	logger, err = zap.NewProduction()
	if err != nil {
		panic("failed to create logger: " + err.Error())
	}

	c.IsValid = true
	c.ClusterARN = os.Getenv("CLUSTER_ARN")
	if c.ClusterARN == "" {
		logger.Error("CLUSTER_ARN not set")
		c.IsValid = false
	}
	c.TaskDefinitionARN = os.Getenv("TASK_DEFINITION_ARN")
	if c.TaskDefinitionARN == "" {
		logger.Error("TASK_DEFINITION_ARN not set")
		c.IsValid = false
	}
	c.ContainerName = os.Getenv("CONTAINER_NAME")
	if c.ContainerName == "" {
		logger.Error("CONTAINER_NAME not set")
		c.IsValid = false
	}
	subnets := os.Getenv("SUBNETS")
	if subnets == "" {
		logger.Error("SUBNETS not set")
		c.IsValid = false
	}
	c.Subnets = strings.Split(subnets, ",")
	c.S3Bucket = os.Getenv("S3_BUCKET")
	if c.S3Bucket == "" {
		logger.Error("S3_BUCKET not set")
		c.IsValid = false
	}
	if !c.IsValid {
		logger.Fatal("Invalid configuration, exiting...")
	}

	lambda.Start(handler)
}

func handler(ctx context.Context, s3Event events.S3Event) error {
	return nil
}
