"use strict";

require('dotenv').config();

var nforce = require('nforce'),
    SF_CLIENT_ID = process.env.SF_CLIENT_ID,
    SF_CLIENT_SECRET = process.env.SF_CLIENT_SECRET,
    SF_USER_NAME = process.env.SF_USER_NAME ,
    SF_PASSWORD = process.env.SF_PASSWORD,
    org = nforce.createConnection({
        clientId: SF_CLIENT_ID,
        clientSecret: SF_CLIENT_SECRET,
        redirectUri: 'http://localhost:3000/oauth/_callback',
        mode: 'single',
        autoRefresh: true
    });

console.log(SF_CLIENT_ID);
console.log(SF_CLIENT_SECRET);
console.log(SF_USER_NAME);
console.log(SF_PASSWORD);

var login = function login() {

    org.authenticate({ username: SF_USER_NAME, password: SF_PASSWORD }, function (err) {
        if (err) {
            console.error("Authentication error");
            console.error(err);
        } else {
            console.log("Authentication successful");
        }
    });
};

var findAccount = function findAccount(name) {

    return new Promise(function (resolve, reject) {
        var q = "SELECT Id, Name, Phone, BillingStreet, BillingCity, BillingState FROM Account WHERE Name LIKE '%" + name + "%' LIMIT 5";
        org.query({ query: q }, function (err, resp) {
            if (err) {
                console.log(err);
                reject("An error as occurred");
            } else {
                resolve(resp.records);
            }
        });
    });
};

var findContact = function findContact(name) {

    return new Promise(function (resolve, reject) {
        var q = "SELECT Id, Name, Phone, MobilePhone, Email FROM Contact WHERE Name LIKE '%" + name + "%' LIMIT 5";
        org.query({ query: q }, function (err, resp) {
            if (err) {
                reject("An error as occurred");
            } else {
                resolve(resp.records);
            }
        });
    });
};

var findOpportunity = function findOpportunity(name) {

    return new Promise(function (resolve, reject) {
        var q = "SELECT Id, Name, Amount, Probability, StageName, CloseDate FROM Opportunity WHERE Name LIKE '%" + name + "%' ORDER BY amount DESC LIMIT 5";
        org.query({ query: q }, function (err, resp) {
            if (err) {
                reject("An error as occurred");
            } else {
                resolve(resp.records);
            }
        });
    });
};

var getTopOpportunities = function getTopOpportunities(count) {

    count = count || 5;

    return new Promise(function (resolve, reject) {
        var q = "SELECT Id, Name, Amount, Probability, StageName, CloseDate FROM Opportunity WHERE isClosed=false ORDER BY amount DESC LIMIT " + count;
        org.query({ query: q }, function (err, resp) {
            if (err) {
                console.log("In get top oppertunities" + err);
                reject("An error as occurred");
            } else {
                console.log(resp.records);
                resolve(resp.records);
            }
        });
    });
};

var createContact = function createContact(contact) {

    return new Promise(function (resolve, reject) {
        var c = nforce.createSObject('Contact');
        c.set('firstName', contact.firstName);
        c.set('lastName', contact.lastName);
        c.set('title', contact.title);
        c.set('phone', contact.phone);
        org.insert({ sobject: c }, function (err, resp) {
            if (err) {
                console.error(err);
                reject("An error occurred while creating a contact");
            } else {
                resolve(c);
            }
        });
    });
};

var createCase = function createCase(newCase) {

    return new Promise(function (resolve, reject) {
        var c = nforce.createSObject('Case');
        c.set('subject', newCase.subject);
        c.set('description', newCase.description);
        c.set('origin', 'Glip');
        c.set('status', 'New');

        org.insert({ sobject: c }, function (err) {
            if (err) {
                console.error(err);
                reject("An error occurred while creating a case");
            } else {
                resolve(c);
            }
        });
    });
};

login();

exports.org = org;
exports.findAccount = findAccount;
exports.findContact = findContact;
exports.findOpportunity = findOpportunity;
exports.getTopOpportunities = getTopOpportunities;
exports.createContact = createContact;
exports.createCase = createCase;


