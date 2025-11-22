import UserModel from './userModel.js';
import { db } from '../utils/firebaseConfig.js';

class AppUserModel extends UserModel {
  static _dbRef = "app/users";

  static async createUserProfile(uid, profileData) {
    return await super.createUserProfile(this._dbRef, uid, profileData);
  }

  /*static async createPatientData(uid, details) {
    try {
      await db.ref(`${this._dbRef}/${uid}/riskfactors`).set(details.riskFactors);
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
      await db.ref(`${dbRef}/${uid}/riskfactors`).remove();
      await db.ref(`${dbRef}/${uid}/results`).remove();
      return await super.deleteUserProfile(this._dbRef, uid);
    } catch (e) {
      console.error(e);
      console.trace();
      return false;
    }
  }

  static async updateUserResults(uid, results) {
    const userResultsRef = db.ref(`${this._dbRef}/${uid}`);
    await userResultsRef.update(results);
    const snapshot = await userResultsRef.once('value');
    if (snapshot.exists()) return snapshot.val();
    else return null;
  }

  static async submitQuestionnaire(uid, questionnaire) {
    const questionnaireRef = db.ref(`${this._dbRef}/${uid}/results/questionnaire`);
    questionnaireRef.push(questionnaire)
    .then((snapshot) => {
      console.log("New questionnaire for user", uid, "with key:", snapshot.key);
      console.log("Full reference:", snapshot.ref.toString());
      return questionnaire;
    })
    .catch((error) => {
      console.error("Error adding questionnaire entry:", error);
    });
  }

  static async submitVoice(uid, voice) {
    const voiceRef = db.ref(`${this._dbRef}/${uid}/results/voice`);
    voiceRef.push(voice)
    .then((snapshot) => {
      console.log("New voice for user", uid, "with key:", snapshot.key);
      console.log("Full reference:", snapshot.ref.toString());
      return voice;
    })
    .catch((error) => {
      console.error("Error adding voice entry:", error);
    });
  }

  static async submitRiskFactors(uid, riskFactors) {
    const riskFactorsRef = db.ref(`${dbRef}/${uid}/riskfactors`);
    await riskFactorsRef.set(riskFactors);
    const snapshot = await riskFactorsRef.once('value');
    if (snapshot.exists()) return snapshot.val();
    else return null;
  }
}

export default AppUserModel;
