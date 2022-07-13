#!/bin/bash
set -e

env=$1
project=sadalsuud
subDomain=lucky-star
domain=celestialstudio.net

echo ====================================================================================
echo env: $env
echo project: $project
echo domain: $subDomain.$domain
echo ====================================================================================

echo execute db scripts...
cd ../db
instance=$2
user=$3
password=$4
for line in $(cat scripts.txt)
do
    echo "executing $line"
    mysql -h $instance -P 3306 -D $project -u $user --password=$password < "$line"
done
echo ====================================================================================

# echo deploy backend AWS...
# cd ../backend
# npm ci
# npm run pre:deploy
# aws cloudformation package --template-file aws/cloudformation/template.yaml --output-template-file packaged.yaml --s3-bucket y-cf-midway
# aws cloudformation deploy --template-file packaged.yaml --stack-name $project-$env-stack --parameter-overrides TargetEnvr=$env Project=$project SubDomain=$subDomain Domain=$domain --no-fail-on-empty-changeset --s3-bucket y-cf-midway
# echo ====================================================================================

# echo deploy frontend to S3...
# cd ./frontend
# npm ci
# npm run pre:deploy
# aws s3 sync ./dist s3://$project-$env --delete --cache-control no-cache
# echo ====================================================================================
