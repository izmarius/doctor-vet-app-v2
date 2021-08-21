const functions = require('firebase-functions');
const admin = require('firebase-admin');

const newUserDefaultPass = "bunvenit123";

exports.doctorCreatesUser = functions.firestore.document('user/{userId}')
  .onCreate((userSnap) => {
    let isUserAlreadyRegistered = false;
    admin.auth().getUserByEmail(userSnap.data().email).then((snap) => {
      isUserAlreadyRegistered = true;
      throw "User already exists";

    }).catch((err) => {
      console.error("Error fetching user data: ", err);
    });

    if(!isUserAlreadyRegistered) {
      admin.auth().createUser({
        email: userSnap.data().email,
        emailVerified: false,
        password: newUserDefaultPass
      }).then((res) => {
        console.log("User Created")
      }).catch((err) => {
        console.error("Error creating new user by doctor - error: ", err)
      });
    }
  });
