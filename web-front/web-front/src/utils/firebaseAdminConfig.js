import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';
import firebaseConfig from '../adminKey.json' with { type: 'json' };

let adminApp;

try {
    adminApp = getApp('adminApp');
} catch (e) {
    adminApp = initializeApp(firebaseConfig, 'adminApp');
}

const adminAuth = getAuth(adminApp);

setPersistence(adminAuth, browserLocalPersistence);
onAuthStateChanged(adminAuth, (user) => { 
  if (user) {
    console.log("User is logged in:", user);
} else {
    console.log("user is not logged in.");
}
});

export { adminAuth as auth };
