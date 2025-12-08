import admin from 'firebase-admin';
import serviceAccount from '../key.json' with { type: 'json' };

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://neuromind-system-g15-default-rtdb.europe-west1.firebasedatabase.app"
});

export const auth = admin.auth(app);
export const db = admin.database(app);