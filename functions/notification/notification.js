const functions = require('firebase-functions');
const admin = require('firebase-admin');
const smsService = require('../smsServices/smsService');
const notificationService = require('../data/notificationsService');
const adminFirestore = admin.firestore();


function getTomorrowNotificationsAndSendSMS() {
  return notificationService.getTomorrowNotifications()
    .then((notificationSnaps) => {
      notificationSnaps.forEach((snap) => {
        smsService.sendSMSNotification({
          message: `Salutare, maine: ${snap.data().dateTime} ai o programare la veterinar pentru prietenul tau cel mai bun. O zi frumoasa iti dorim, echipa Doctor Vet`,
          phoneNumber: snap.data().userPhone
        }).then(message => {
          console.log(`Notification sent to ${snap.data().userPhone}  with data: `, JSON.stringify(snap.data()));
          notificationService.deleteNotification(snap.id);
        }).catch((error) => {
          console.error(`ERROR - SMS notifications failed to ${smsPayload.phoneNumber}`, JSON.stringify(error));
        });
      });
    }).catch((error) => {
      console.error('ERROR - Getting notification failed with error: ', error);
    });
}

exports.getNotifications = functions.https.onRequest(async (req, res) => {
  getTomorrowNotificationsAndSendSMS();
  res.send("Success");
});

exports.addNotification = functions.firestore.document('appointments/{appointmentId}')
  .onCreate((snap, context) => {
    const collection = adminFirestore.collection('notifications');
    collection.add(snap.data());
    // email notification
    console.log(`Added appointment with id: ${snap.id} and created notification for it`,);
    return null;
  });

exports.deleteNotification = functions.firestore.document('appointments/{appointmentId}')
  .onUpdate((snap, context) => {
    console.log("Assignment: ", JSON.stringify(snap.after.data()));
    if (snap && snap.after && snap.after.data() && (snap.after.data().isCanceledByDoctor || snap.after.data().isCanceledByUser)) {
      const notification = adminFirestore.collection('notifications', ref => ref.where('id', '==', snap.after.data().id))
        .get()
        .then((res) => {
          console.log("Notification snap: ", JSON.stringify(res));
          res.forEach(snap => {
            console.log("Notification2: ", JSON.stringify(snap.data()));
          });
        });
      // collection.doc().delete().then(() => {
      //   console.log(`Delete appointment from notification with id: ${snap.id} and created notification for it`);
      //   return null;
      // }).catch((error) => {
      //   console.error(`Failed to delete appointment from notification with id: ${snap.id} with error ${JSON.stringify(error)}`);
      // });:
    }
    return null;
  });


// todo see what to do when you have multiple clients - batching and querying with limits
exports.scheduledSMSNotification = functions.pubsub
  .schedule('0 7 * * *')
  .onRun((context) => {
    console.log('Timestamp notification: ', context.timestamp);
    getTomorrowNotificationsAndSendSMS();
  });
