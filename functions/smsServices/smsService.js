const functions = require('firebase-functions');

const client = require('twilio')(functions.config().doctorvet.twillio_account_sid, functions.config().doctorvet.twillio_token);
exports.sendSMSNotification = function sendSMSNotification(smsPayload) {
  const roPrefix = '+4'
  if(!smsPayload.message || !smsPayload.phoneNumber) {
    console.warn('Phone data or message missing from sms payload');
    return;
  } else if(smsPayload.phoneNumber.length > 12 || smsPayload.phoneNumber.length < 12) {
    console.warn('Phone number has a wrong format for Romania');
    return;
  } else if(roPrefix !== smsPayload.phoneNumber.slice(0,2)) {
    console.warn('Phone number has a wrong prefix for Romania');
    return;
  }

  return client.messages.create({body: smsPayload.message, from: functions.config().doctorvet.twillio_phone, to: smsPayload.phoneNumber});
}

