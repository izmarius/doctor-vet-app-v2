const admin = require('firebase-admin');
const adminFirestore = admin.firestore();


function setDateToFetch() {
  let tomorrow = new Date();
  let nextDayAfterTomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  console.log('tomorrow time: ', tomorrow.getTime());
  tomorrow.setHours(0, 0);
  tomorrow = tomorrow.getTime();
  nextDayAfterTomorrow.setDate(nextDayAfterTomorrow.getDate() + 2);
  console.log('Next day after tomorrow time: ', nextDayAfterTomorrow.getTime());
  nextDayAfterTomorrow.setHours(0, 0);
  nextDayAfterTomorrow = nextDayAfterTomorrow.getTime();

  return {
    tomorrow,
    nextDayAfterTomorrow
  }
}

exports.getTomorrowNotifications = function getTomorrowNotifications() {
  let collection = adminFirestore.collection('notifications');
  const dates = setDateToFetch();
  collection = collection
    .where('timestamp', '>=', dates.tomorrow)
    .where('timestamp', '<', dates.nextDayAfterTomorrow);
  return collection.get().then((snaps) => {
    return snaps;
  }).catch((error) => {
    console.error('ERROR - Notification failed with: ', error);
  });
}

exports.deleteNotification = function deleteNotification(docId) {
  adminFirestore.collection('notifications').doc(docId).delete().then(r => {
    console.log(`Appointment with id ${docId} was deleted with success`);
  }).catch((error) => {
    console.error(`ERROR - Deletion of appointment ${docId} failed with error: `, error);
  });
}

