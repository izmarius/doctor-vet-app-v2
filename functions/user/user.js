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

exports.createUserByDoctor = functions.https.onCall(async (user, context) => {
  console.log("Start creating user", user.email);
  try {
    const createdUser = await admin.auth().createUser({
      email: user.email,
      emailVerified: true,
      password: user.password,
      disabled: false,
    });

    console.log("User created by doctor: ", user.email);
    return {
      response: createdUser
    };
  } catch (error) {
    console.error("Error while creating user: ", error)
    throw error;
  }
});
