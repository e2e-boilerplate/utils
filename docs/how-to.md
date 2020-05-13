# Utilities

Utilities for automating the daily tasks of maintaining the e2e-boilerplate organization.

Scenario, I use these to clone and install dependencies for 100+ repositories with a single command before heading out
to a coffee shop or when working outdoor with no internet connection.

This could be used for any public GitHub `user` or `organization` by changing the `--pages` and `--username` parameters.
Default page size is `2` ~ enough for about `200` repositories.

## Generate repositories list first

Get repositories name list. If you have more repositories increase the `--pages` param. e.g. 2 for (100 > repository < 200).

        npm run get:repos
        npm run get:repos -- --pages 3 --username=your_github_org_or_username

## Clone

Clone repositories using the repositories list generated ^^.

        npm run git:clone
        npm run git:clone --username=your_github_org_or_username

## Install Node dependencies

Install package dependencies for all repositories. This may take time depending on the number of repositories and/or dependencies you have.

        npm run install:deps
        npm run install:deps -- --username=your_github_org_or_username

## Pull

Pull the latest changes for all repositories.

        npm run git:pull
        npm run git:clone --username=your_github_org_or_username

## Add

Add changes for all repositories.

npm run git:add

## Commit

Commit changes for all repositories.

npm run git:commit -- --message=your_commit_message

## Push

Push changes for all repositories.

npm run git:push

## Run command on a specific module

Push changes for cypress repositories only.

npm run git:push --module=cypress

## Update package.json metadata

Can update a package.json metadata for all repositories. Example, updating the keyword and author fields for all repositories.

        npm run set:metadata -- --keywords="e2e-e2e tests-boilerplate-example-integration test" --author="Girma Nigusse <xgirma@gmail.com> (https://github.com/xgirma)"

### Warning

Using this on a GitHub username or org-name that has large (number of) repositories and dependencies could maxout your disk space.

## Gist

Working with gist should be done in the following order

        npm run gist:get
        npm run gist:list
        npm run gist:create
        npm run gist:update


# Traffic

Collect 14 days github traffic data and generates documentation in the `docs` repo.

    npm run traffic:meta -- --token token
    npm run traffic:doc
