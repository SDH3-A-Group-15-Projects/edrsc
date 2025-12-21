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

static async getAllUserProfiles() {
      try {
        const profilesFromSuper = await super.getAllUserProfiles(this._dbRef);
        if (profilesFromSuper.length === 0) return [];
        else {
          for (const doctor of profilesFromSuper) { 
            const uid = doctor.uid;
  
            const patientsSnapshot = await db.ref(`${this._dbRef}/${uid}/patients`).once('value');
            if (patientsSnapshot.exists()) {
                doctor.patients = patientsSnapshot.val();
            } else {
                doctor.patients = null;
            }
          }
        }
        return profilesFromSuper;
      } catch (e) {
        console.error("Error getting patient profile:", e);
        console.trace();
        return null;
      }
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
    patientRef.child(patientUID).set(true)
    .catch((error) => {
      console.error("Error adding patient:", error);
      return null;
    });
    return patientUID;
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

  static async removePatient(uid, patientUID) {
    const patientRef = db.ref(`${this._dbRef}/${uid}/patients/${patientUID}`);
    console.log(patientRef.toString());
    return patientRef.set(null)
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
