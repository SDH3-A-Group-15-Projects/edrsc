import { db } from '../utils/firebaseConfig.js';

class UserModel {
  static async createUserProfile(dbRef, uid, profileData) {
    const userProfileRef = db.ref(`${dbRef}/${uid}/profile`);
    await userProfileRef.set(profileData);
    const snapshot = await userProfileRef.once('value');
    if (snapshot.exists()) return snapshot.val();
    else return null;
  }

  static async getUserProfile(dbRef, uid) {
    const userProfileRef = db.ref(`${dbRef}/${uid}/profile`);
    const snapshot = await userProfileRef.once('value');

    if (snapshot.exists()) return snapshot.val();
    else return null;
  }

  static async getAllUserProfiles(dbRef) {
    const allUsersRef = db.ref(dbRef);
    const snapshot = await allUsersRef.once('value');

    if (!snapshot.exists()) return [];

    const allUsersData = snapshot.val();
    const profiles = [];

    for (const uid in allUsersData) {
      if (allUsersData.hasOwnProperty(uid)) {
        const userData = allUsersData[uid];
        if (userData && userData.profile) {
          profiles.push({ uid: uid, profile: userData.profile });
        }
      }
    }

    return profiles;
  }

  static async updateUserProfile(dbRef, uid, profileDataUpdate) {
    const userProfileRef = db.ref(`${dbRef}/${uid}/profile`);
    const oldSnapshot = await userProfileRef.once('value');
    if (oldSnapshot.exists()) {
      const newProfileData = {
        ...profileDataUpdate,
        createdAt: oldSnapshot.val().createdAt,
        email: oldSnapshot.val().email
      }

      await userProfileRef.update(newProfileData);

      const newSnapshot = await userProfileRef.once('value');
      if (newSnapshot.exists()) return newSnapshot.val();
      else return null;
    } else {
      const profileData = {
        ...profileDataUpdate,
        createdAt: new Date().toISOString()
      }

      return await this.createUserProfile(dbRef, uid, profileData)
    }
  }

  static async deleteUserProfile(dbRef, uid) {
    const userProfileRef = db.ref(`${dbRef}/${uid}/profile`);
    try {
      await userProfileRef.remove();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}

export default UserModel;
