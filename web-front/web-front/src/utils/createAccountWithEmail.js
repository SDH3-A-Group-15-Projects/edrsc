import { auth } from "../firebaseConfig.js";
import { createUserWithEmailAndPassword } from "firebase/auth";


export async function registerNewUser(firstName, lastName, email, password) {
  try {
    await createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      await fetch(`http://localhost:3001/api/web/users/${user.uid}/profile`, {
          method: "POST",
          body: JSON.stringify({
              uid: user.uid,
              email: email,
              firstName: firstName,
              lastName: lastName
          }),
          headers: {
              "Authorization": `Bearer ${idToken}`,
              "Content-Type": "application/json"
          }
        })
        .then(res => res.json())
        .then(res => {
          if (res.ok) console.log(res);
          else throw(Error(`HTTP ${res.status} - ${res.statusText}`));
        });

      console.log("User created with UID ", user.uid);
      console.log("User email:", user.email);

      console.log("Operation Type:", userCredential.operationType);
    });
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error in creating user:", errorCode, errorMessage);
    
    if (errorCode === 'auth/email-already-in-use') {
      alert("This email address is already in use!");
    } else if (errorCode === 'auth/weak-password') {
      alert("Password is too weak. Please choose a stronger password.");
    }
    throw error;
  }
}