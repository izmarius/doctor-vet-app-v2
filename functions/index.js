const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const accountSid = "AC3214cd7bf8c9aa77a7bbe9ec5bb7988f";
const authToken = "39e271387d5e29a511af4bb1174c6d2f";
const client = require('twilio')(accountSid, authToken);

// create a function to get all appointments that are tomorrow and send notification
// exista maine appointments? daca da atunci trimite notificare - ora 14


exports.sendSMSNotification = functions.https.onCall((data) => {
  client.messages
    .create({body: 'Marius ii un sugaci', from: '+16318304395', to: data.phoneNumber})
    .then(message => {
      return "sms"
    });
});

exports.getAllAppointments = functions.https.onRequest(async (req, res) => {
  const adminFirestore = admin.firestore();
  const collection = adminFirestore.collection('doctors');

  collection.get().then(snapshot => {
    snapshot.forEach(doc => {
      res.send(doc.data());
      console.log( "data: ", doc.data() );
    });
  });
})


// exports.userAdded = functions.auth.user().onCreate((user)=>{
//   console.log('user created');
//   // send welcome mesage
//   return Promise.resolve();
// })

exports.hello = functions.https.onRequest((req, res) => {
  res.send('Hello');
});

exports.scheduledSMSNotification = functions.pubsub.schedule('15 20 * * *').onRun((context) => {
  // get all appointments of the day , and get user phone number and send message to him
  // sendSMSNotification({phoneNumber: })
  console.log('This will be run every 5 minutes!');
});


