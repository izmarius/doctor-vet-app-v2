const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const notification = require('./notification/notification');

exports.notification = notification.addNotification;
exports.scheduledSMSNotification = notification.scheduledSMSNotification;
exports.getNotifications = notification.getNotifications;

