# Utils

Utils for automating the daily tasks of maintaining the e2e-boilerplate organization. 
Generate the list of repositories, clone and install dependencies.

Could be used for any public GitHub `user` or `organization` by changing the `--pages` and `--username` param.
Default page size is `2` aproximately enough for `200` repositories.

## Generate 
Get all repositories name. If you have more repositories increase the `--pages` param.

        npm run repos
        npm run repos -- --pages 3 --username=your_github_org_or_username
        
Increase the pages number as needed.
        
## Clone
Clone all repositories.

        npm run clone
        npm run clone ---username=your_github_org_or_username
        
## Dependencies 
Install npm dependencies for all repositories. This may take some time.

        npm run deps
        npm run deps -- --username=your_github_org_or_username 
        
## Pull
Pull the latest changes for all repositories

        npm run pull 
        npm run clone ---username=your_github_org_or_username

## Warning 
Using this on a GitHub username or org-name that has large (number of) repositories and dependencies could maxout your disk space.
