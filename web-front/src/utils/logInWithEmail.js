import { auth } from "..index/.js";
import { signInWithEmailAndPassword } from "firebase/auth";


export async function loginWithEmail(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        const user = userCredential.user;
        console.log("User signed in successfully:", user);
        console.log("User ID:", user.uid);
        console.log("User email:", user.email);

        return user;
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error signing in:", errorCode, errorMessage);

        if (errorCode === 'auth/user-not-found') {
            alert("No account found with this email.");
        } else if (errorCode === 'auth/wrong-password') {
            alert("Incorrect password. Please try again.");
        } else if (errorCode === 'auth/incalid-email') {
            alert("The email address is badly formatted.");
        } else {
            alert("Login failed. Please try again.");
        }

        throw error;
    }
}