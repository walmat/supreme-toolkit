# Supreme Toolkit

## Features

* Babel 7
* Express
* Mongo

## Installation

* `git clone https://github.com/walmat/supreme-form-api.git`
* `cd supreme-form-api`
* `npm install` or `yarn`
* `npm start` or `yarn start`

### Routes

* visit http://localhost:3000
  * /us - latest us form data
  * /eu - latest eu form data
  * /jp - latest jp form data
  * /pooky - a collection of recent pooky versions with their tohru, timestamp, and region

### Configuration

I've provided a sample `.env` file called `.env.sample`. Simply rename this file by `mv .env.sample .env` and fill in your desired config.

###### PORT
Leave this at 3000 unless you have something else running on that port

###### POLL RATES
Each region has it's own specified poll rate. By default, they are at 2.5 seconds (2500ms).

###### DATABASE URL
This API leverages MongoDB which is used to store the form fields and pooky versions. If you do not have mongoDB installed yet, feel free to download for your machine [here](https://www.mongodb.com/download-center/enterprise).

**Note: You can leave the database url as is if you don't care what it's called.**

###### DISCORD WEBHOOK
Input your discord webhook here-- or don't!

###### USE SINGLE REGION
If you just want to monitor a single region, set this to `true` otherwise make sure it's set to `false`.

###### SINGLE REGION
This only matters if `USE_SINGLE_REGION=true`. Allows you to specify which region.

Options: US | EU | JP

###### PROXIES
**Important: Proxies are needed for monitoring regions that you are NOT located on**

I've added a few safeguards to prevent improper form data being stored for the wrong region,
but to make sure this is avoided, please test your proxies and make sure they are able to ping
supreme in that specific region.

### Contributing

Please feel free to make any ammendments or changes to this as you feel fit. Please open an issue following the template provided before opening a pull request. Pull requests are always welcome and will be reviewed.
