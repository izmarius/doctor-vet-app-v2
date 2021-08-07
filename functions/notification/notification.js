const functions = require('firebase-functions');
const admin = require('firebase-admin');
const smsService = require('../smsServices/smsService');
const notificationService = require('../data/notificationsService');
const adminFirestore = admin.firestore();


function getTomorrowNotificationsAndSendSMS() {
  notificationService.getTomorrowNotifications()
    .then((notificationSnaps) => {
      notificationSnaps.forEach((snap) => {
        smsService.sendSMSNotification({
          message: `Salutare, maine: ${snap.data().dateTime} ai o programare la veterinar pentru prietenul tau cel mai bun. O zi frumoasa iti dorim, echipa Doctor Vet`,
          phoneNumber: snap.data().phone
        })
        console.log(`Notification sent with data: `, JSON.stringify(snap.data()));
      });
    });
}

exports.getNotifications = functions.https.onRequest(async (req, res) => {
  getTomorrowNotificationsAndSendSMS();
  res.send("Success");
})

exports.addNotification = functions.firestore.document('user/{userId}/animals/{animalId}/appointments/{appId}')
  .onCreate((snap, context) => {
    console.log(`Added appointment with id: ${snap.id} and created notification for it`,);
    const collection = adminFirestore.collection('notifications');
    collection.add(snap.data());
  });

exports.scheduledSMSNotification = functions.pubsub.schedule('0 15 * * *').onRun((context) => {
  getTomorrowNotificationsAndSendSMS();
  console.log('This will be run every 5 minutes!');
});
