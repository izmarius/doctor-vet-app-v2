const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

const accountSid = "AC3214cd7bf8c9aa77a7bbe9ec5bb7988f";
const authToken = "39e271387d5e29a511af4bb1174c6d2f";
const client = require('twilio')(accountSid, authToken);

exports.sendSMSNotification = functions.https.onCall( (data) => {
  client.messages
    .create({body: 'Marius ii un sugaci', from: '+16318304395', to: data.phoneNumber})
    .then(message => {
      return "sms"
    });
});
