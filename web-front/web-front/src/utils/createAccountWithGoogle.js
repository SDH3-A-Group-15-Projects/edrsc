import { auth } from "../firebaseConfig.js";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export async function createAccountWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("User created successfully:", user);
    console.log("User ID:", user.uid);

    console.log("Operation Type:", result.operationType);

    return user; 
  } catch (error) {

    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error creating user:", errorCode, errorMessage);

    if (errorCode === 'auth/google-in-use') {
      alert("This Google account is already in use!");
    }
    throw error;
  }
}