import { auth } from "../firebaseConfig.js";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export async function logInWithGoogle() {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        console.log("User logged in successfully:", user);
        console.log("User ID:", user.uid);
        console.log("Operation Type:", result.operationType);

        return user;
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.error("Error logging in with Google:", errorCode, errorMessage);

        if (errorCode === 'auth/account-exists-with-different-credential') {
            alert("An account with this email already exists with a different sign-in method.");
        }
        throw error;
    }
}