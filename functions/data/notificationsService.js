const admin = require('firebase-admin');
const adminFirestore = admin.firestore();


function setDateToFetch() {
  let tomorrow = new Date();
  console.log('Current hour: '+  tomorrow.getHours() + 'current minutes: ' + tomorrow.getMinutes());
  let nextDayAfterTomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  console.log('tomorrow: ', tomorrow.toLocaleDateString());
  tomorrow.setHours(0, 0);
  tomorrow = tomorrow.getTime();
  nextDayAfterTomorrow.setDate(nextDayAfterTomorrow.getDate() + 2);
  console.log('Next day after tomorrow: ', nextDayAfterTomorrow.toLocaleDateString());
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
  }).catch((err) => {
    console.error('Notification failed with: ', err);
  });
}

