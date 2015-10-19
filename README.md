# share-analytics.io

Simple application made for Rockaway AWS Hackathon. see http://www.ferschmann.cz/rockaway-aws-hackathon-aneb-utratit-co-nejvic-penez/

It is all dirty copy and paste, because we had limited time. So don't look and judge :-)

It is written in JavaScript and uses extensively parallel HTTP invocation using promises. 

It was developed using "node-lambda".

Modules:

* www - web application
* lambda - simple service that for given URL downloads URL share count from Twitter, Facebook, LinkedIn and Google+. It is used from web application over API GW.
* lambda-bulk-mass - bulk upload for large files. It splits data over 100 records and calls lambda-bulk. It is used from web application over API GW.
* lambda-bulk - service that has same API as lambda-bulk-mass but calls directly lambda-fetch for handling one record.
* lambda-cron - service that is called every 5 minutes as Scheduled event (handled by AWS directly). It select all URLs from SQL DB and calls lambda-cron-batch for every 100 records.
* lambda-cron-batch - this service receives list of URLS to handle and for every one calls lambda-fetch.
* lambda-fetch - service that is copied from lambda and handles the same data but uses internal URL ID that is provided from lambda-cron-batch or lambda-bulk.

Files in directories:
* index.js - lambda function
* model.js - configuration for SQL database
* .env - configuration for simple deployment using "node-lambda deploy". Now not working as account was suspended.
* event.json - example event file for local testing of lambda function
* package.json - configuration for npm
