import UserModel from './userModel.js';
import { db } from '../utils/firebaseConfig.js';

class WebUserModel extends UserModel {
  static _dbRef = "web/users";

  static async createUserProfile(uid, profileData) {
    return await super.createUserProfile(this._dbRef, uid, profileData);
  }

  /*static async createDoctorData(uid, details) {
      try {
        await db.ref(`${this._dbRef}/${uid}/patients`).set(details.patients);
        await db.ref(`${this._dbRef}/${uid}/results`).set(details.results);
        return true;
      } catch (e) {
        console.error(e);
        console.trace();
        return false;
      }
    }*/

  static async getUserProfile(uid) {
    return await super.getUserProfile(this._dbRef, uid);
  }

  static async updateUserProfile(uid, profileDataUpdate) {
    return await super.updateUserProfile(this._dbRef, uid, profileDataUpdate);
  }

  static async deleteUserProfile(uid) {
      try {
        await db.ref(`${this._dbRef}/${uid}/patients`).remove();
        return await super.deleteUserProfile(this._dbRef, uid);
      } catch (e) {
        console.error(e);
        console.trace();
        return false;
      }
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
      return null;
    });
  }

  static async getPatients(uid) {
    try {
      const patientRef = db.ref(`${this._dbRef}/${uid}/patients`); 
      const snapshot = await patientRef.once('value');
      const patients = snapshot.val();

      if (patients) {
        const patientsArray = Object.keys(patients);
        /*.map(key => {
          return { ...patients[key] };
        });*/
        return patientsArray;
      } else {
        return null;
      }
    } catch (e) {
      console.error("Error getting patients:", e);
      throw e;
    }
  }

  /**
   * @todo: IDs fetchable by firebase aren't going to be the same as the patient IDs, you can find a way to set them when added
   */
  static async removePatient(uid, patientUID) {
    const patientRef = db.ref(`${this._dbRef}/${uid}/patients/${patientUID}`);
    return patientRef.remove()
    .then(() => {
      console.log("Removed patient with ID:", patientUID, "for user:", uid);
      return patientUID;
    })
    .catch((error) => {
      console.error("Error removing patient with ID:", patientUID, "for user:", uid, "Error:", error);
      return null;
    });
  }
}

export default WebUserModel;
