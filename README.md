# Northcoders News API

## Welcome

The hosted version of this API can be accessed here: https://nc-news-portfolio.onrender.com

- Summary
This is a summary in here about the project

- Provide clear instructions of how to clone, install dependencies, seed local database, and run tests

- Specify minimum versions of `Node.js` and `Postgres` needed to run the project


If you would like to clone this respository, you will have to set up your own environment variables in order to successfully connect to the two databases. The instructions for this are below:

1. Fork and clone this repository

2. Create two .env files, both in the root directory. 

    - these should be named .env.test and .env.development
    - each file should contain one line of code: PGDATABASE=<name-of-database>
    - the names of the databases an be found in the setup.sql file
    - make sure that the 'test' database is in the .env.test file
    - make sure that both .env files are added to .gitignore

    You can see an example of the file names and their content in .env.example

3. Run 'npm install' from your terminal

4. Look in the package.json for the available scripts, you can use:
    - 'npm run setup-dbs' - allows the databases to be set up
    - 'npm run seed' - seeds all the data into the database
    - npm test - runs the test suite - the env variable will connect to the test database and use the data in the test-data folder

5. Have fun!



