const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const notification = require('./notification/notification');


const adminFirestore = admin.firestore();

exports.notification = notification.addNotification;
exports.scheduledSMSNotification = notification.scheduledSMSNotification;
exports.getNotifications = notification.getNotifications;

exports.getAllAppointments = functions.https.onRequest(async (req, res) => {
  const collection = adminFirestore.collection('doctors');

  collection.get().then(snapshot => {
    snapshot.forEach(doc => {
      res.send(doc.data());
      console.log("data: ", doc.data());
    });
  });
})


