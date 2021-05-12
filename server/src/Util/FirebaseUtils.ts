import admin from 'firebase-admin';
const serviceAccount = require('./ServiceAccountKey.json');

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const createAcc = async (uid: string, username: string, email: string) => {
  db.collection('accounts')
    .doc(uid)
    .set({
      username: username,
      email: email,
      address: null,
    })
    .then(() => {
      console.log('Acc successfully created!');
    })
    .catch((error) => {
      console.error('Error writing document: ', error);
      throw error;
    });
};

const addAccAddress = async (uid: string, address: string) => {
  const accRef = db.collection('accounts').doc(uid);

  try {
    const res = await accRef.update({
      address: address,
    });
    console.log(res);
  } catch (error) {
    console.log('Add address to db failed');
    console.log(error);
  }
};

const getUsername = async (uid: string) => {
  const accRef = db.collection('accounts').doc(uid);
  let username;

  try {
    const result = await accRef.get();
    username = result.data().username;
  } catch (error) {
    throw error;
  }

  return username;
};

export { addAccAddress, createAcc, getUsername };
