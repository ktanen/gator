# Gator

## Prerequisites:

- Developed with Node 22.14.0 and PostgreSQL 16.14
- A gatorConfig.json file in your home directory
    - This contains a single JSON object with the following fields:
        - "db_url": value = your PostgreSQL connection string
        - "current_user_name": Set this to an empty string or null initially.
            - The program will update this automatically when you run the login command.
## Setup:

1. npm install
2. npm run generate
3. npm run migrate

## Usage:

Run "npm run start <command> [arguments]" from the root of the repo.

## Commands:
- register <username>: register a user to the database
- login <username>: switches the current user to the provided username, given that the name has been registered
- reset: Clears the database
- users: Lists all users in the database
- addfeed <url>: Adds the feed corresponding to the URL to the database and follows it
- follow <url>: Follows the feed corresponding to the URL if the user is not already following it
- unfollow <url>: Unfollows the feed corresponding to the URL
- following: Shows all feeds the current user is following
- feeds: Shows all feeds in the database
- agg <time_between_reqs>: Collects posts from the feeds in the database periodically until you kill the aggregator
- browse [limit]: Shows the latest [limit] posts from the feeds that you follow; limit is optional and defaults to 2

