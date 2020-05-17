# Utilities

Utilities for automating the daily tasks of maintaining the e2e-boilerplate organization.

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
    npm run install:deps --module=cypress

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

## Daily routine

    npm run repos:meta:get
    npm run git:pull
    npm run dependencies:update
    npm run package:json:write
    npm run git:add
    npm run git:commit
    npm run git:push

## Working with Gist

Working with gist MUST be done in the following order, else duplicate gists will be created. First get existing `gists` list using `gist:get:meta`.
Then generate existing gists list using `gist:create:list`, once the `list.json` file generated, you can create a new `gist`, using `gist:create:new`,
create new will use `list.json` not to create duplicate gists. Create Gist will only create a blank gist, you need to use update gist `gist:update:populate`
to add content to the created list.

        npm run gist:get:meta
        npm run gist:create:list
        npm run gist:create:new
        npm run gist:update:populate

# Traffic data overview

Collect 14 days github traffic data and generates documentation in the `docs` repo for audit.

    npm run traffic:meta -- --token token
    npm run traffic:doc

# Update dependencies and package.json

Get the latest code. Update `dependencies/dependencies.json` with upgraded/downgraded module version. Then update the entire `package.json`.

    npm run git:pull
    npm run dependencies:update
    npm run package:json:write

# Run misc command line for all repos

You could run a common command for all repositories, like removing node_modules from all repositories like this

    npm run execute:any:command -- --command "rm -rf node_modules"

# Generate common files

You can generate `README.MD`, GitHub actions `workflow.yaml`, styling, and configuration files as shown below

    npm run create:readme
    npm run create:funding
    npm run create:workflow
    npm run create:style:eslintrc
    npm run create:style:tslint
    npm run create:config:jest
    npm run create:config:mocha
    npm run create:config:protractor
    npm run create:config:webdriverio
    npm run create:config:tsconfig

### Warning

Using this on a GitHub username or org-name that has large (number of) repositories and dependencies could maxout your disk space or crash your IDE :)
