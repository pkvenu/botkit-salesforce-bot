"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var color = "#009cdb";

var formatAccounts = function formatAccounts(accounts) {
    if (accounts && accounts.length > 0) {
        var _ret = function () {
            var attachments = [];
            accounts.forEach(function (account) {
                var fields = [];
                fields.push({ title: "Name", value: account.get("Name"), short: true });
                fields.push({ title: "Link", value: "https://login.salesforce.com/" + account.getId(), short: true });
                fields.push({ title: "Phone", value: account.get("Phone"), short: true });
                fields.push({ title: "Address", value: account.get("BillingStreet") + ", " + account.get("BillingCity") + " " + account.get("BillingState"), short: true });
                attachments.push({ color: color, fields: fields });
            });
            return {
                v: attachments
            };
        }();

        if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
    } else {
        return [{ text: "No records" }];
    }
};

var formatContacts = function formatContacts(contacts) {

    if (contacts && contacts.length > 0) {
        var _ret2 = function () {
            var attachments = [];
            contacts.forEach(function (contact) {
                var fields = [];
                fields.push({ title: "Name", value: contact.get("Name"), short: true });
                fields.push({ title: "Email", value: contact.get("Email"), short: true });
                fields.push({ title: "Phone", value: contact.get("Phone"), short: true });
                fields.push({ title: "Mobile", value: contact.get("MobilePhone"), short: true });
                fields.push({ title: "Link", value: "https://login.salesforce.com/" + contact.getId(), short: false });
                attachments.push({ color: color, fields: fields });
            });
            return {
                v: attachments
            };
        }();

        if ((typeof _ret2 === "undefined" ? "undefined" : _typeof(_ret2)) === "object") return _ret2.v;
    } else {
        return [{ text: "No records" }];
    }
};

var formatContact = function formatContact(contact) {

    var fields = [];
    fields.push({ title: "Name", value: contact.get("FirstName") + " " + contact.get("LastName"), short: true });
    fields.push({ title: "Phone", value: contact.get("Phone"), short: true });
    fields.push({ title: "Title", value: contact.get("Title"), short: false });
    fields.push({ title: "Link", value: "https://login.salesforce.com/" + contact.getId(), short: false });
    return [{ color: color, fields: fields }];
};

var formatOpportunities = function formatOpportunities(opportunities) {

    if (opportunities && opportunities.length > 0) {
        var _ret3 = function () {
            var attachments = [];
            opportunities.forEach(function (opportunity) {
                var fields = [];
                fields.push({ title: "Opportunity", value: opportunity.get("Name"), short: true });
                fields.push({ title: "Stage", value: opportunity.get("StageName"), short: true });
                fields.push({ title: "Amount", value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(opportunity.get("Amount")), short: true });
                fields.push({ title: "Probability", value: opportunity.get("Probability") + "%", short: true });
                fields.push({ title: "Link", value: "https://login.salesforce.com/" + opportunity.getId(), short: false });
                attachments.push({ color: color, fields: fields });
            });
            return {
                v: attachments
            };
        }();

        if ((typeof _ret3 === "undefined" ? "undefined" : _typeof(_ret3)) === "object") return _ret3.v;
    } else {
        return [{ text: "No records" }];
    }
};

var formatCase = function formatCase(_case) {

    var fields = [];
    fields.push({ title: "Subject", value: _case.get("subject"), short: true });
    fields.push({ title: "Link", value: 'https://login.salesforce.com/' + _case.get("id"), short: true });
    fields.push({ title: "Description", value: _case.get("description"), short: false });
    return [{ color: color, fields: fields }];
};

exports.formatAccounts = formatAccounts;
exports.formatContacts = formatContacts;
exports.formatContact = formatContact;
exports.formatOpportunities = formatOpportunities;
exports.formatCase = formatCase;
