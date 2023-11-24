# Northcoders News API
The hosted link: https://xing-wei-app.onrender.com

This project is about processing the database which contains four tables: articles, topics, users and comments. They are releated with each other and we can access the all the data of a table or filter the result by an article_id for example.

To clone this repo, the link is: https://github.com/XingWei0920/xing-wei-personal-project

The following dependencies are required.
1. express
2. dotenv
3. express
4. match
5. pg
6. jest-sorted
7. pg-format
8. supertest
9. jest

By running "npm run setup-dbs", the database will be setup.

By running "npm run seed", the tables will be created inside the databe.

By running "npm run test", all the tests will be run.

There are 2 .env files that need to be created. 
The first one should be named as .env.test and it should be filled by "PGDATABASE=nc_news_test".
The second one should be named as .env.development and it should be filled by "PGDATABASE=nc_news".


For instructions, please head over to [L2C NC News](https://l2c.northcoders.com/courses/be/nc-news).
