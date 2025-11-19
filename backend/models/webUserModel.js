import UserModel from './userModel.js';

class WebUserModel extends UserModel {
  static _dbRef = "web/users";

  static async createUserProfile(uid, profileData) {
    return await super.createUserProfile(this._dbRef, uid, profileData);
  }

  static async getUserProfile(uid) {
    return await super.getUserProfile(this._dbRef, uid);
  }

  static async updateUserProfile(uid, profileDataUpdate) {
    return await super.updateUserProfile(this._dbRef, uid, profileDataUpdate);
  }

  static async deleteUserProfile(uid) {
    return await super.deleteUserProfile(this._dbRef, uid);
  }

  static async addPatient(uid, patientUID) {
    const patientRef = db.ref(`${this._dbRef}/${uid}/patients`);
    questionnaireRef.push({uid: patientUID})
    .then((snapshot) => {
      console.log("New patient with UID", patientUID, "for user", uid, "with key:", snapshot.key);
      console.log("Full reference:", snapshot.ref.toString());
      return patientUID;
    })
    .catch((error) => {
      console.error("Error adding patient:", error);
    });
  }

  static async getPatients(uid) {
    const patientRef = db.ref(`${this._dbRef}/${uid}/patients`);
    patientRef.once('value').then((snapshot) => {
        const patientsObject = snapshot.val();
        if (patientsObject) {
          const patientsArray = Object.keys(patientsObject).map(key => {return {...patientsObject[key]}});
          return patientsArray;
        } else return null;
    })
    .catch((e) => {
      console.error("Error getting patients:", e);
    });
  }
}

export default WebUserModel;
