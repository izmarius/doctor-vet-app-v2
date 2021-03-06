const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const notification = require('./notification/notification');
const user = require('./user/user');

exports.scheduledSMSNotification = notification.scheduledSMSNotification;
exports.getNotifications = notification.getNotifications;
exports.addNotification = notification.addNotification;
// exports.deleteNotification = notification.deleteNotification;

exports.createNewUser = user.doctorCreatesUser;
exports.createUserByDoctor = user.createUserByDoctor;
