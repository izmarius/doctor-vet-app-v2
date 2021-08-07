const accountSid = "AC3214cd7bf8c9aa77a7bbe9ec5bb7988f";
const authToken = "3cdbaa465051482368755c3f52dae31b";
const client = require('twilio')(accountSid, authToken);
const TWILIO_NUMBER = '+16318304395';

exports.sendSMSNotification = function sendSMSNotification(smsPayload) {
  client.messages
    .create({body: smsPayload.message, from: TWILIO_NUMBER, to: smsPayload.phoneNumber})
    .then(message => {
      console.log(`SMS notifications sent to ${smsPayload.phoneNumber}`)
    }).catch((erorr) => {
    console.error(`SMS notifications failed to ${smsPayload.phoneNumber}`, erorr);
  });
}

