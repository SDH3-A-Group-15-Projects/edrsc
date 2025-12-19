import { auth } from "../index.js";
import { signInWithEmailAndPassword } from "firebase/auth";


export async function loginWithEmail(email, password) {
    try {
        //let userProfile = null;

        await signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            const idToken = await user.getIdToken();

            /*await fetch(`http://localhost:3001/api/web/users/${user.uid}/profile`, {
                method: "GET",
                body: JSON.stringify({
                    uid: user.uid,
                }),
                headers: {
                    "Authorization": `Bearer ${idToken}`,
                    "Content-Type": "application/json"
                }
                })
                .then(res => res.json())
                .then(res => {
                if (res.ok) console.log(res);
                else throw(new Error(`HTTP ${res.status} - ${res.statusText}`));
                userProfile = res.body;
                });*/

                // get id token then store in a cookie and redirect, perform the above get request on the page with the user info

            console.log("Fetched User with UID ", user.uid);

            console.log("Operation Type:", userCredential.operationType);

            //return userProfile;
            });
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error signing in:", errorCode, errorMessage);

        if (errorCode === 'auth/user-not-found') {
            alert("No account found with this email.");
        } else if (errorCode === 'auth/wrong-password') {
            alert("Incorrect password. Please try again.");
        } else if (errorCode === 'auth/invalid-email') {
            alert("The email address is badly formatted.");
        } else {
            alert("Login failed. Please try again.");
        }

        throw error;
    }
}