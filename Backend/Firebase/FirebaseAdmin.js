const admin = require('firebase-admin');
const serviceAccount = require('./firebase-adminsdk.json'); // path to your file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
