const functions = require('firebase-functions');
const admin = require('firebase-admin');
const smsService = require('../smsServices/smsService');
const notificationService = require('../data/notificationsService');
const emailNotification = require('../notification/emailNotification');
const adminFirestore = admin.firestore();


function getTomorrowNotificationsAndSendSMS() {
  return notificationService.getTomorrowNotifications()
    .then((notificationSnaps) => {
      notificationSnaps.forEach((snap) => {
        smsService.sendSMSNotification({
          message: `Salutare, maine: ${snap.data().dateTime} ai o programare la veterinar pentru prietenul tau cel mai bun. O zi frumoasa iti dorim, echipa Doctor Vet`,
          phoneNumber: snap.data().phone
        }).then(message => {
          console.log(`Notification sent to ${snap.data().phone}  with data: `, JSON.stringify(snap.data()));
          notificationService.deleteNotification(snap.id);
        }).catch((erorr) => {
          console.error(`ERROR - SMS notifications failed to ${smsPayload.phoneNumber}`, erorr);
        });
      });
    }).catch((error) => {
    console.error('ERROR - Getting notification failed with error: ', error);
  });
}

exports.getNotifications = functions.https.onRequest(async (req, res) => {
  getTomorrowNotificationsAndSendSMS();
  res.send("Success");
})

exports.addNotification = functions.firestore.document('user/{userId}/animals/{animalId}/appointments/{appId}')
  .onCreate((snap, context) => {
    const collection = adminFirestore.collection('notifications');
    collection.add(snap.data());
    // email notification
    emailNotification.emailNotification(snap.data());
    console.log(`Added appointment with id: ${snap.id} and created notification for it`,);
    return null;
  });

exports.scheduledSMSNotification = functions.pubsub.schedule('0 7 * * *').onRun((context) => {
  getTomorrowNotificationsAndSendSMS();
});
