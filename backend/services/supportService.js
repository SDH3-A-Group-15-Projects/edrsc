import SupportUserModel from "../models/supportModel.js";

class SupportService {
    static async exportAnonymisedData() {
        const patients = await SupportUserModel.getAllUserProfiles();
        if (!patients || patients.length === 0) return null;
        return patients.map(p => {
            p.dateOfBirth = p.profile.dateOfBirth;
            delete p['uid'];
            delete p['profile'];
            return p;
        });
    }

    static async submitSupportRequest(uid, message) {
        const supportRequest =  {
            uid: uid,
            message: message,
            dateSubmitted: new Date().toISOString(),
            status: "open",
        }
        const result = await SupportUserModel.submitSupportRequest(uid, supportRequest);
        if (result) return result.id;
        else return null;
    }

    static async getAllSupportRequests() {
        //return await SupportUserModel.getAllSupportRequests();
    }

    /*static async getAllDoctors() {
        const doctors = await WebUserModel.getAllUserProfiles();
        if (!doctors || doctors.length === 0) return null;
        return doctors.map(d => {
            d = {
                uid: d.uid,
                firstName: d.profile.firstName,
                lastName: d.profile.lastName,
                noOfPatients: (d.patients ? Object.keys(d.patients).length : 0),
            }
            return d;
        });
    }*/
}

export default SupportService;