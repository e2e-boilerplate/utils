# Utils

Utils for automating the daily tasks of maintaining the e2e-boilerplate organization. Generate the list of repositories, clone and install dependencies for all repositories in the organization.

## Generate 
Get all repositories name. 

        npm run repos
        npm run repos - --pages 3
        
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
