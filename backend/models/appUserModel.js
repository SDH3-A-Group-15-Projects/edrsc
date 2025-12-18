import UserModel from './userModel.js';
import { db } from '../utils/firebaseConfig.js';

class AppUserModel extends UserModel {
  static _dbRef = "app/users";

  static async createUserProfile(uid, profileData) {
    return await super.createUserProfile(this._dbRef, uid, profileData);
  }

  static async getUserProfile(uid) {
    try {
      let patient = {};
      const profileDataFromSuper = await super.getUserProfile(this._dbRef, uid);
      patient.profile = profileDataFromSuper;
      
      const resultsSnapshot = await db.ref(`${this._dbRef}/${uid}/results`).once('value');
      if (resultsSnapshot.exists()) patient.results = resultsSnapshot.val();
      else patient.results = null;

      return patient;
    } catch (e) {
      console.error("Error getting patient profile:", e);
      console.trace();
      return null;
    }
  }

  static async getAllUserProfiles() {
    try {
      const profilesFromSuper = await super.getAllUserProfiles(this._dbRef);
      if (profilesFromSuper.length === 0) return [];
      else {
        for (const patient of profilesFromSuper) {
          const uid = patient.uid;

          const riskFactorsSnapshot = await db.ref(`${this._dbRef}/${uid}/riskfactors`).once('value');
          if (riskFactorsSnapshot.exists()) patient.riskFactors = riskFactorsSnapshot.val();
          else patient.riskFactors = null;

          const resultsSnapshot = await db.ref(`${this._dbRef}/${uid}/results`).once('value');
          if (resultsSnapshot.exists()) patient.results = resultsSnapshot.val();
          else patient.results = null;
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
      await db.ref(`${this._dbRef}/${uid}/riskfactors`).remove();
      await db.ref(`${this._dbRef}/${uid}/results`).remove();
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
    try {
      const questionnaireRefPath = db.ref(`${this._dbRef}/${uid}/results/questionnaire`);
      const questionnaireRef = questionnaireRefPath.push();
      questionnaire.id = questionnaireRef.key;

      if (!questionnaire.id) {
        console.error("Failed to generate key for questionnaire.");
        return null;
      }
      
      await questionnaireRef.set(questionnaire);

      return questionnaire;
    } catch (e) {
      console.error("Error adding questionnaire to database:", e.message);
      return null;
    }
  }

  static async getQuestionnaireById(uid, id) {
    try {
      const questionnaireRef = db.ref(`${this._dbRef}/${uid}/results/questionnaire/${id}`);
      const snapshot = await questionnaireRef.once('value');
      if (snapshot.exists()) return snapshot.val();
      else return null;
    } catch (e) {
      console.error(`Error getting questionnaire ${id}:`, e.message);
      return null;
    }
  }

  static async submitVoice(uid, voice) {
    try {
      const voiceRefPath = db.ref(`${this._dbRef}/${uid}/results/voice`);
      const voiceRef = voiceRefPath.push();
      voice.id = voiceRef.key;

      if (!voice.id) {
        console.error("Failed to generate key for voice results.");
        return null;
      }

      await voiceRef.set(voice);

      return voice;
    } catch (e) {
      console.error("Error adding voice to database:", e.message);
      return null;
    }
  }

  static async submitRiskFactors(uid, riskFactors) {
    const riskFactorsRef = db.ref(`${this._dbRef}/${uid}/riskfactors`);
    await riskFactorsRef.set(riskFactors);
    const snapshot = await riskFactorsRef.once('value');
    if (snapshot.exists()) return snapshot.val();
    else return null;
  }

  static async submitAppRating(uid, rating, review) {
    const ratingRef = db.ref(`${this._dbRef}/${uid}/rating`);
    await ratingRef.set({ rating, review });
    const snapshot = await ratingRef.once('value');
    if (snapshot.exists()) return snapshot.val();
    else return null;
  }

  static async getAllRatings() {
    const allUsersRef = db.ref(this._dbRef);
    const snapshot = await allUsersRef.once('value');

    if (!snapshot.exists()) return [];
    const allUsersData = snapshot.val();
    const profiles = [];

    for (const uid in allUsersData) {
      if (allUsersData.hasOwnProperty(uid)) {
        const userData = allUsersData[uid];
        if (userData && userData.rating) {
          profiles.push({ uid: uid, rating: userData.rating.rating, review: userData.rating.review });
        }
      }
    }

    return profiles;
  }
}

export default AppUserModel;
