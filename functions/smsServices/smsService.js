const functions = require('firebase-functions');

const client = require('twilio')(functions.config().doctorvet.twillio_account_sid, functions.config().doctorvet.twillio_token);
exports.sendSMSNotification = function sendSMSNotification(smsPayload) {
  //  todo validate phone number & message
  // if(smsPayload.phoneNumber) {
  //   const phoneNumberRoPrefix = smsPayload.phoneNumber.slice(0, 2);
  //   if()
  // }
  return client.messages.create({body: smsPayload.message, from: functions.config().doctorver.twillio_phone, to: smsPayload.phoneNumber});
}

