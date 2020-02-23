# Utils

Utils for automating the daily tasks of maintaining the e2e-boilerplate organization. 
Generate the list of repositories, clone and install dependencies for all repositories in the organization.

Could be used for any public GitHub user or organization by changing the `--username` param.

## Generate 
Get all repositories name. If you have more repositories increase the `--pages` param.

        npm run repos
        npm run repos - --pages 3 --username yourusername
        
Increase the pages number as needed.
        
## Clone
Clone all repositories.

        npm run clone
        
## Dependencies 
Install npm dependencies for all repositories. This may take some time.

        npm run deps
        
## Pull
Pull the latest changes for all repositories

        npm run pull 
