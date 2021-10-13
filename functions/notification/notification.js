const functions = require('firebase-functions');
const admin = require('firebase-admin');
const smsService = require('../smsServices/smsService');
const notificationService = require('../data/notificationsService');
const adminFirestore = admin.firestore();


function getTomorrowNotificationsAndSendSMS() {
  return notificationService.getTomorrowNotifications()
    .then((notificationSnaps) => {
      notificationSnaps.forEach((snap) => {
        // if(snap.data() && !snap.data().isCanceled) {
          smsService.sendSMSNotification({
            message: `Salutare, maine: ${snap.data().dateTime} ai o programare la veterinar pentru prietenul tau cel mai bun. O zi frumoasa iti dorim, echipa Doctor Vet`,
            phoneNumber: snap.data().phone
          }).then(message => {
            console.log(`Notification sent to ${snap.data().phone}  with data: `, JSON.stringify(snap.data()));
            notificationService.deleteNotification(snap.id);
          }).catch((error) => {
            console.error(`ERROR - SMS notifications failed to ${smsPayload.phoneNumber}`, JSON.stringify(error));
          });
        // }
      });
    }).catch((error) => {
      console.error('ERROR - Getting notification failed with error: ', error);
    });
}

exports.getNotifications = functions.https.onRequest(async (req, res) => {
  getTomorrowNotificationsAndSendSMS();
  res.send("Success");
})

exports.addNotification = functions.firestore.document('animal-appointments/{appointmentId}')
  .onCreate((snap, context) => {
    const collection = adminFirestore.collection('notifications');
    collection.add(snap.data());
    // email notification
    console.log(`Added appointment with id: ${snap.id} and created notification for it`,);
    return null;
  });

// exports.addNotification = functions.firestore.document('animal-appointments/{appointmentId}')
//   .onUpdate((snap, context) => {
//     const collection = adminFirestore.collection('notifications');
//     // at update animal app - update also notification! - dupa if notification is Canceled nu mia trimite sms / sau trimite sms ca notifacrea a fost stearsa de doctor
//     collection.doc(snap.data().id).update({isCanceled: });
//     // email notification
//     console.log(`Added appointment with id: ${snap.data().id} and created notification for it`,);
//     return null;
//   });

exports.scheduledSMSNotification = functions.pubsub
  .schedule('0 7 * * *')
  .timeZone('Europe/Bucharest')
  .onRun((context) => {
    console.log('Timestamp notification: ', context.timestamp);
    getTomorrowNotificationsAndSendSMS();
  });
