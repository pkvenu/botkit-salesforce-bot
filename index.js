"use strict";

require('dotenv').config();

var Botkit = require('botkit'),
    os = require('os'),
    url = require('url'),
   // redisURL = process.env.REDIS_URL || "redis://127.0.0.1:6739",
   // redis_storage = require('botkit-storage-redis'),
    http = require('http'),
    request = require('request'),
    formatter = require('./modules/glip-formatter'),
    salesforce = require('./modules/salesforce');

//var redis_store = new redis_storage({url: redisURL});

var controller = Botkit.glipbot({
    debug: false,
    //storage: redis_store,
});

var bot = controller.spawn({
    server: process.env.GLIP_SERVER,
    appKey: process.env.GLIP_APPKEY,
    appSecret: process.env.GLIP_APPSECRET,
    username: process.env.GLIP_USERNAME,
    password: process.env.GLIP_PASSWORD,
    extension: process.env.GLIP_EXTENSION,
}).startRTM(function (err) {
    // bot.startConversation(message,function(err,convo) {
    //     if(err){
    //         console.log(err);
    //     }else{
    //         convo.say('I am a bot that has just joined your team');
    //         convo.say('You must now /invite me to a channel so that I can be of use!');
    //     }
    // });
});

controller.setupWebserver(process.env.port || 3000, function(err, webserver){
    webserver.get('/', function (req ,res) {
        res.send(':)');
    });
    controller.createWebhookEndpoints(webserver, bot);
});

// var _bots ={};
// function trackBot(bot) {
//     _bots[bot.config.token] = bot;
// }

// controller.on('create_bot', function(bot,config){
//     if(_bots[bot.config.token]){
//         console.log('Already Online')
//     }else {
//         bot.startRTM(function(err){
//             if(!err){
//                 trackBot(bot);
//             }
//
//             bot.startConversation(message,function(err,convo) {
//                 if(err){
//                     console.log(err);
//                 }else{
//                     convo.say('I am a bot that has just joined your team');
//                     convo.say('You must now /invite me to a channel so that I can be of use!');
//                 }
//             })
//         })
//     }
// });
//
// controller.storage.teams.all(function (err, teams) {
//     if(err){
//         throw new Error(err);
//     }
//
//     for(var t in teams){
//         if(teams[t].bot){
//             var bot = controller.spawn(teams[t]).startRTM(function (err) {
//                 if(err){
//                     console.log('Error connecting bot to Slack:', err)
//                 }else{
//                     trackBot(bot);
//                 }
//             })
//         }
//     }
// })


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

controller.hears(['salesforce: search contact (.*)', 'salesforce: find contact (.*)'], 'message_received', function (bot, message) {
    var name = message.match[1];
    salesforce.findContact(name).then(function (contacts) {
        console.log(JSON.stringify(contacts));

        if (contacts && contacts.length > 0) {
            var data = null;
            data = "I found these contacts matching  '" + name + "':\n\n"
            contacts.forEach(function (contacts) {
                data += "**Name**\n\n"
                data += contacts.get("Name") + "\n\n"
                data += "**Email**\n\n"
                data += contacts.get("Email") + "\n\n"
                data += "**phone**\n\n"
                data +=  contacts.get("Phone") + "\n\n"
                data += "**Link**\n\n"
                data += "https://login.salesforce.com/" + contacts.getId()+ "\n\n"
            })
            bot.reply(message, data);
        } else {
            bot.reply(message, "No contacts found for " + name );
        }
    });
});

controller.hears(['salesforce: top (.*) deals', 'salesforce: top (.*) opportunities'], 'message_received', function (bot, message) {
    var count = message.match[1];
    console.log("count:" + count);
    salesforce.getTopOpportunities(count).then(function (opportunities) {
        console.log(opportunities);
        if (opportunities && opportunities.length > 0) {
            var data = null;
            data = "Here are your top " + count + " records :\n\n"
            opportunities.forEach(function (opportunity) {
                data += "**Name**\n"
                data += opportunity.get("Name") + "\n\n"
                data += "**Stage**\n"
                data += opportunity.get("StageName")+ "\n\n"
                data += "**Amount**\n"
                data += new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                    }).format(opportunity.get("Amount")) + "\n\n"
                data += "**Probability**\n"
                data +=  opportunity.get("Probability") + "% \n\n"
                data += "**Link**\n"
                data += "https://login.salesforce.com/" + opportunity.getId() + "\n\n"
            });

            return bot.reply(message, data);
        } else {
            return bot.reply(message, "No new opportunities found");
        }
    });
});

controller.hears(['salesforce: search opportunity (.*)', 'salesforce: find opportunity (.*)'], 'message_received', function (bot, message) {
    var name = message.match[1];
    salesforce.findOpportunity(name).then(function (opportunities) {
        console.log(JSON.stringify(opportunities));
        if (opportunities && opportunities.length > 0) {
            var data = null;
            data = "I found these opportunities matching  '" + name + "': \n\n"
            opportunities.forEach(function (opportunity) {
                data += "**Name**\n\n"
                data +=  opportunity.get("Name") + "\n\n"
                data += "**Stage**\n\n"
                data +=  opportunity.get("StageName") + "\n\n"
                data += "**Amount**\n\n"
                data += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(opportunity.get("Amount")) + "\n\n"
                data += "**Probability**\n\n"
                data += opportunity.get("Probability") + "% \n\n"
                data += "**Link**\n\n"
                data += "https://login.salesforce.com/" + opportunity.getId()+ "\n\n"
            });
            bot.reply(message, data);
        }else {
            bot.reply(message, "No new opportunites found for " + name );
        }

    });

});

controller.hears(['salesforce: create case', 'salesforce: new case'], 'message_received', function (bot, message) {

    var subject, description = null;

    var askSubject = function askSubject(response, convo) {

        convo.ask("What's the subject?", function (response, convo) {
            subject = response.text;
            askDescription(response, convo);
            convo.next();
        });
    };

    var askDescription = function askDescription(response, convo) {

        convo.ask('Enter a description for the case', function (response, convo) {
            description = response.text;
            salesforce.createCase({ subject: subject, description: description }).then(function (_case) {
                var data = null;
                data = "New Case Created: \n\n"
                data += "**Subject**\n\n"
                data +=  _case.get("subject") + "\n\n"
                data += "**Description**\n\n"
                data += _case.get("description") + "\n\n"
                data += "**Link**\n\n"
                data += "https://login.salesforce.com/" + _case.get("id") + "\n\n"
                bot.reply(message, data);
                convo.next();
            });
        });
    };

    bot.reply(message, "OK, I can help you with that!");
    bot.startConversation(message, askSubject);
});


controller.hears(['salesforce: create contact', 'salesforce: new contact'], 'message_received', function (bot, message) {

    var firstName, lastName, title, email, phone = null;

    var askFirstName = function askFirstName(response, convo) {

        convo.ask("What's the first name?", function (response, convo) {
            firstName = response.text;
            askLastName(response, convo);
            convo.next();
        });
    };

    var askLastName = function askLastName(response, convo) {

        convo.ask("What's the last name?", function (response, convo) {
            lastName = response.text;
            askTitle(response, convo);
            convo.next();
        });
    };

    var askEmail = function askEmail(response, convo) {

        convo.ask("What's the Email?", function (response, convo) {
            email = response.text;
            askTitle(response, convo);
            convo.next();
        });
    };

    var askTitle = function askTitle(response, convo) {

        convo.ask("What's the title?", function (response, convo) {
            title = response.text;
            askPhone(response, convo);
            convo.next();
        });
    };

    var askPhone = function askPhone(response, convo) {

        convo.ask("What's the phone number?", function (response, convo) {
            phone = response.text;
            salesforce.createContact({ firstName: firstName, lastName: lastName, email: email, title: title, phone: phone }).then(function (contact) {
                var data = null;
                data = "New contact created :\n\n"
                data += "**Name**\n\n"
                data += contact.get("FirstName") + " " + contact.get("LastName") + "\n\n"
                data += "**Phone**\n\n"
                data += contact.get("Phone") + "\n\n"
                data += "**Title**\n\n"
                data += contact.get("Title") + "\n\n"
                data += "**Email**\n\n"
                data += contact.get("email") + "\n\n"
                data += "**Link**\n\n"
                data += "https://login.salesforce.com/" + contact.get("id") + "\n\n"
                bot.reply(message, data);
                convo.next();
            });

        });
    };

    bot.reply(message, "OK, I can help you with that!");
    bot.startConversation(message, askFirstName);
});












