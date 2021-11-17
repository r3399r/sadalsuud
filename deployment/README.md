# Deployment Process

## Dev environment

Github action would do auto-deployment when any pull request is merged into `dev`.

If one wants to do deployment manually, please run `bash deploy-dev.sh` with propert configuration.

## Production Release

1. Decide the version number
2. Create new branch from `dev` called `release-**`
3. Change the version in each folder manually
4. Merge release branch to both `master` and `dev`
5. Github action would carry the deployment job when the PR is merged into `master`.