import { auth } from "../index.js";
import { sendPasswordResetEmail } from "firebase/auth";

export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        console.log("Password reset email sent to:", email);
        alert("A password reset email has been sent to your inbox.");
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error sending password reset email:", errorCode, errorMessage);

        if (errorCode === 'auth/user-not-found') {
            alert("No account found with this email address.");
        } else if (errorCode === 'auth/invalid-email') {
            alert("Please enter a valid email address.");
        } else {
            alert("Failed to send reset email. Please try again later.");
        }

        throw error;
    }
}