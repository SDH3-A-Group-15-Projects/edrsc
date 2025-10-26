import { auth } from "../index.js";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";


export async function registerNewUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // User account created & signed in!
    const user = userCredential.user;
    console.log("User created successfully:", user);
    console.log("User ID:", user.uid);
    console.log("User email:", user.email);

    console.log("Operation Type:", userCredential.operationType);

    return user; 
  } catch (error) {

    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error creating user:", errorCode, errorMessage);

    if (errorCode === 'auth/email-already-in-use') {
      alert("This email address is already in use!");
    } else if (errorCode === 'auth/weak-password') {
      alert("Password is too weak. Please choose a stronger password.");
    }
    throw error;
  }
}