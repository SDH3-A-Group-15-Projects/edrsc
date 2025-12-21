import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { setPersistence, browserLocalPersistence, onAuthStateChanged } from "firebase/auth";

import config from './key.json';

const app = initializeApp(config);
const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence);
onAuthStateChanged(auth, (user) => { 
  if (user) {
    console.log("User is logged in:", user);
} else {
    console.log("user is not logged in.");
}
});

export { app, auth };
