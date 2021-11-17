#!/bin/bash
set -e

env=$1
project=sadalsuud
host=lucky-star-trip.net

echo ====================================================================================
echo env: $env
echo project: $project
echo host: $host
echo ====================================================================================

echo deploy backend AWS...
cd ../backend
npm ci
npm run pre:deploy
aws cloudformation package --template-file aws/cloudformation/template.yaml --output-template-file packaged.yaml --s3-bucket y-cf-midway
aws cloudformation deploy --template-file packaged.yaml --stack-name $project-$env-stack --parameter-overrides TargetEnvr=$env HostName=$host --no-fail-on-empty-changeset
echo ====================================================================================

echo deploy frontend to S3...
cd ../frontend
npm ci
npm run pre:deploy
aws s3 sync ./dist s3://$project-$env --delete --cache-control no-cache
echo ====================================================================================

if [ $1 = "prod" ]
  echo "do tagging process..."
  cd ..
  version=$(node -pe "require('./package.json').version")
  git config --global user.email "github-actions-bot@github.com"
  git config --global user.name "github-actions-bot"
  git tag -a $version -m "$version"
  git push origin $version
fi
