import { db } from '../utils/firebaseConfig.js';

class SupportModel {
  static _dbRef = "support";

  static async submitSupportRequest(uid, supportRequest) {
    try {
      const supportRequestRefPath = db.ref(`${this._dbRef}/`);
      const supportRequestRef = supportRequestRefPath.push();
      supportRequest.id = supportRequestRef.key;
      if (!supportRequest.id) {
        console.error("Failed to generate key for support request.");
        return null;
      }
      
      await supportRequestRef.set(supportRequest);
      return supportRequest;
    } catch (e) {
      console.error("Error adding support request to database:", e.message);
      return null;
    }
  }

  static async getAllSupportRequests() {
    try {
      const allReqsRef = db.ref(this._dbRef); 
      const snapshot = await allReqsRef.once('value');

      if (!snapshot.exists()) {
          return [];
      }

      const allReqsData = snapshot.val();
      
      return Object.values(allReqsData);

    } catch (e) {
        console.error("Error fetching support requests:", e);
        return [];
    }
  }
}

export default SupportModel;