const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  secure: false,
  requireTLS: true,
  auth: {
    user: 'pausan.ionut.adrian@gmail.com',
    pass: 'Wearewhatwerepeatedlydo'
  }
});


exports.emailNotification = function sendEmail(snap) {
  // todo validate email
  return transporter.sendMail(getMailOptions(snap), (error, info) => {
    if(error){
      console.error(`ERROR - Email notifaction for email: ${snap.email} failed with: `, error)
    }
    console.log(`Email sent to ${snap.email}`);
  });
}

function getMailOptions(snap) {
  const MAIL_BODY = `<h1>Progamarea dumneavoastra a fost facuta cu success</h1>
                   <p> <b>Doctor: </b>${snap.doctorName}</p>
                   <p> <b>Data: </b>${snap.dateTime}</p>
                   <p> <b>Locatia: </b>${snap.location}</p>`

  return {
    from: `pausan.ionut.adrian@gmail.com`,
    to: snap.email,
    subject: 'Detalii programare',
    html: MAIL_BODY
  };
}
