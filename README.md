# botkit-salesforce-bot


[![Code-Style:Standard](https://img.shields.io/badge/code%20style-standard-green.svg?style=flat-square)](http://standardjs.com/)
[![License:MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![chat-svg](https://img.shields.io/badge/chat-on%20glip-orange.svg)](https://glipped.herokuapp.com/)

`botkit-salesforce-bot` allows you to create conversational Salesforce apps ("bots") via RingCentral and glip API using [Botkit](https://www.github.com/howdyai/botkit)'s familiar  interface.

It takes advantage of Botkit's core functionality thus allowing you to create complex conversational flows via a simple interface. It also allows you to use [custom storage methods/systems](https://github.com/howdyai/botkit/blob/master/readme.md#storing-information) to enable data persistence across sessions.

#### What is Botkit?

Here's an excerpt of Botkit's `readme.md` file:

> [[Botkit](https://www.github.com/howdyai/botkit)] provides a semantic interface to sending and receiving messages so that developers can focus on creating novel applications and experiences instead of dealing with API endpoints.

## Use Case

You can use `botkit-salesforce-bot` to query salesforce to obtain the following information 
* Search account Acme or Search Acme in acccounts
```
salesforce: search account <ACCOUNT_NAME>
```
* Search contact Lisa Smith or Search Lisa Smith in contacts
```
salesforce: search contact <CONTACT_NAME>
```
* Top 5 deals (Default to 5 deals)
```
salesforce: top <NUMBER> deals
```
* Search opportunity Big Deal
```
salesforce: search opportunity <OPPORTUNITY_NAME>
```
* Create contact
```
salesforce: create contact 
```

* Create case
```
salesforce: create case
```


## Installation

```bash
$ npm install  
```

First, create a copy of env.template file and rename it to .env. Configure the properties in the file:
```
* `GLIP_SERVER`: Glip server (sandbox: https://platform.devtest.ringcentral.com or production: https://platform.ringcentral.com)
* `GLIP_APPKEY`: Application Key 
* `GLIP_APPSECRET`: Application Secret
* `GLIP_USERNAME`: RingCentral Username
* `GLIP_PASSWORD`: RingCentral Password
* `GLIP_EXTENSION`: RingCentral Extension
* `SF_CLIENT_ID`: Salesforce ClientID
* `SF_CLIENT_SECRET`: Salesforce ClientSecret
* `SF_USER_NAME`: Salesforce Username
* `SF_PASSWORD`: Salesforce Password
```

Run the command in the terminal to launch the bot.
```
$ npm start
```

## Details

*Note: This document assumes that you are familiarized with Botkit and RingCentral API*

```js

require('dotenv').config();

var Botkit = require('botkit'),
    os = require('os'),
    url = require('url'),
    http = require('http'),
    request = require('request'),
    formatter = require('./modules/glip-formatter'),
    salesforce = require('./modules/salesforce');


var controller = Botkit.glipbot({
    debug: false,
});


```

`spawn()` your bot instance:

```js
var bot = controller.spawn({
    server: process.env.GLIP_SERVER,
    appKey: process.env.GLIP_APPKEY,
    appSecret: process.env.GLIP_APPSECRET,
    username: process.env.GLIP_USERNAME,
    password: process.env.GLIP_PASSWORD,
    extension: process.env.GLIP_EXTENSION,
}).startRTM();
```

Then you need to set up your Web server and create the webhook endpoints so your app can receive Glip messages:

```js
controller.setupWebserver(process.env.PORT, function (err, webserver) {
  controller.createWebhookEndpoints(controller.webserver, bot, function () {
    console.log('Glip-Salesforce-bot is online!')
  })
})
```

And finally, you can setup listeners for specific messages, like you would in any other `botkit` bot:

```js
controller.hears(['salesforce: search account (.*)', 'salesforce: search (.*) in accounts'], 'message_received', function (bot, message) {
    var name = message.match[1];
    salesforce.findAccount(name).then(function (accounts) {
        console.log(JSON.stringify(accounts));
        if(accounts && accounts.length > 0){
            var data = null;
            data = "I found these accounts matching  '" + name + "':\n\n"
            accounts.forEach(function (account) {
                data += "**Name** \n\n"
                data +=  account.get("Name") + "\n\n"
                data += "**Link**"
                data += "https://login.salesforce.com/" + account.getId() + "\n\n"
                data += "**Phone**"
                data += account.get("Phone") + "\n\n"
                data += "**Address**"
                data += account.get("BillingStreet") + ", " + account.get("BillingCity") + " " + account.get("BillingState") + "\n\n"
            })
            bot.reply(message, data);
        } else {
            bot.reply(message, "No Accounts found for " + name );
        }
    });
});
```


## Reference

Please see `botkit`'s guide and reference document [here](https://github.com/howdyai/botkit/blob/master/readme.md#developing-with-botkit).


## Contributing

#### Bug Reports & Feature Requests

Something does not work as expected or perhaps you think this module needs a feature? Please [open an issue](https://github.com/pkvenu/botkit-salesforce-bot/issues/new) using GitHub's [issue tracker](https://github.com/pkvenu/salesforce-bot/issues). Please be as specific and straightforward as possible.

#### Developing

Pull Requests (PRs) are welcome. Make sure you follow the same basic stylistic conventions as the original code (i.e. ["JavaScript standard code style"](http://standardjs.com)). Your changes must be concise and focus on solving a single problem.

## License

[The MIT License (MIT)](http://opensource.org/licenses/MIT)

Copyright (c) 2016 
