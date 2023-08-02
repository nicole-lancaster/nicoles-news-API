# Nicole's News API 📰


## Welcome 👋


This is my Application Programming Interface (API) for Nicole's News, which serves up data on multiple endpoints.

Below is some more information about the API, including how you can set it up on your local machine.

This API is hosted here --> https://nc-news-portfolio.onrender.com/ 

To view all available endpoints, you can make a GET request to /api or view the `endpoints.json` file in the repository.

This API is consumed in my front-end application of view and interact with here --> https://nicoles-news.netlify.app/


## Summary

- Built with Node, Postgres (PSQL) and Express
- Follows REST and CRUD principles
- Follows the Model-View-Controller (MVC) architectural pattern
- All endpoints and error handling developed using test-driven development (TDD) using Jest

## Prerequistes ⏸️
You will need Node and Postgres in order to run this API:

Postgress
Minimum version required: 12.14

Node
Minimum version required: 18.13.0
To check your current version: run `node -v` in your terminal

## Getting set up ▶️
You are now ready to set up the API on your own machine by following the steps below:

1. Clone this repository
    - make sure you have git installed on your machine
    - in your terminal, navigate to the location in which you wish to save this repository
    - run this command: `git clone https://github.com/nicole-lancaster/nc-news-api`
    - cd into the repository using this command: `cd nc-news-api`
    - you are now ready to open this on your IDE of choice. If this is VSCode, run the command `code nc-news-api`
    - 

2. Create two .env files, both in the root directory. 
    - one should be named `.env.test` and the other named `.env.development`
    - each file should contain one line of code: `PGDATABASE=<name-of-database>`
    - the names of the databases can be found in the setup.sql file
    - make sure that the 'test' database is in the .env.test file
    - make sure that both .env files are added to your gitignore file

    You can see an example of the file names and their content in the `.env.example` file
   

3. Run `'npm install'` from your terminal to install the required dependencies
   

4. You can open the package.json for the available scripts, you can run:
    - `npm run setup-dbs` - allows the databases to be set up
    - `npm run seed` - seeds all the data into the database
    - `npm test` - runs the test suite - the env variable will connect to the test database and use the data in the test-data folder
      

5. Have fun!


## Feedback welcome 🫶

I had a lot of fun building this, and always strive to improve. Any comments or suggestions for improvement are gratefully received so please feel free to submit a pull request or go to the social links on my main GitHub page to get in touch.

