import UserModel from './userModel.js';
import { db } from '../utils/firebaseConfig.js';

class AppUserModel extends UserModel {
  static _dbRef = "app/users";

  static async createUserProfile(uid, profileData, details) {
    return await super.createUserProfile(this._dbRef, uid, profileData, details);
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

  static async submitQuestionnaire(uid, questionnaire) {
    const questionnaireRef = db.ref(`${this._dbRef}/${uid}/results/questionnaire`);
    questionnaireRef.push(newQuestionnaireEntry)
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
    voiceRef.push(newVoiceEntry)
    .then((snapshot) => {
      console.log("New voice for user", uid, "with key:", snapshot.key);
      console.log("Full reference:", snapshot.ref.toString());
      return voice;
    })
    .catch((error) => {
      console.error("Error adding voice entry:", error);
    });
  }
}

export default AppUserModel;
