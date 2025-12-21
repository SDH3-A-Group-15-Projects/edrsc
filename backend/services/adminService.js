import AppUserModel from "../models/appUserModel.js";
import WebUserModel from "../models/webUserModel.js";

class AdminService {
    static async exportAnonymisedData() {
        const patients = await AppUserModel.getAllUserProfiles();
        if (!patients || patients.length === 0) return null;
        return patients.map(p => {
            p.dateOfBirth = p.profile.dateOfBirth;
            delete p['uid'];
            delete p['profile'];
            return p;
        });
    }

    static async getAllDoctors() {
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
    }

    static async getAllRatings() {
        const ratings = await AppUserModel.getAllRatings();
        if (!ratings || ratings.length === 0) return null;
        return ratings;
    }
}

export default AdminService;