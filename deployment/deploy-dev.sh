#!/bin/bash
set -e

env=dev
project=sadalsuud
host=lucky-star-trip.net

echo ====================================================================================
echo env: $env
echo project: $project
echo host: $host
echo ====================================================================================

echo deploy backend AWS...
cd ../backend
npm run pre:deploy
aws cloudformation package --template-file aws/cloudformation/template.yaml --output-template-file packaged.yaml --s3-bucket y-cf-midway
aws cloudformation deploy --template-file packaged.yaml --stack-name $project-$env-stack --parameter-overrides TargetEnvr=$env HostName=$host --no-fail-on-empty-changeset
echo ====================================================================================

echo deploy frontend to S3...
cd ../frontend
npm run pre:deploy
aws s3 sync ./dist s3://$project-$env --delete --cache-control no-cache
echo ====================================================================================
