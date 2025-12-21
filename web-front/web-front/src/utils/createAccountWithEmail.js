import { auth } from "../firebaseConfig.js";
import { createUserWithEmailAndPassword } from "firebase/auth";

export async function registerNewUser(firstName, lastName, email, password) {
  console.log("Step 1: Attempting to create user in Firebase...");
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  console.log("Step 1 Success: User created with UID:", user.uid);

  const idToken = await user.getIdToken();

  console.log("Step 2: Sending data to backend...");
  
  const response = await fetch(`http://localhost:3001/api/web/users/${user.uid}/profile`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${idToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      uid: user.uid,
      email: email,
      firstName: firstName,
      lastName: lastName
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Backend Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log("Step 2 Success: Backend updated", data);

  return user;
}