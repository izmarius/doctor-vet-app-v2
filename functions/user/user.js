const functions = require('firebase-functions');
const admin = require('firebase-admin');

const newUserDefaultPass = "bunvenit123";

exports.doctorCreatesUser = functions.firestore.document('user/{userId}')
  .onCreate((userSnap) => {
    let isUserAlreadyRegistered = false;
    admin.auth().getUserByEmail(userSnap.data().email).then((snap) => {
      isUserAlreadyRegistered = true;

    }).catch((err) => {
      console.error("No user found - saving new user");
      if(!isUserAlreadyRegistered) {
        admin.auth().createUser({
          email: userSnap.data().email,
          emailVerified: false,
          password: newUserDefaultPass,
          uid: userSnap.id
        }).then((res) => {
          // todo send email validation
          console.log("User Created");
        }).catch((err) => {
          console.error("Error creating new user by doctor - error: ", err)
        });
      }
    });


  });
