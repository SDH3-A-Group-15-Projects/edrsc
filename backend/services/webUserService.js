import UserService from "./userService.js";
import WebUserModel from "../models/webUserModel.js";
import AppUserModel from "../models/appUserModel.js";


class WebUserService extends UserService {
    static async createUserProfile(uid, firstName, lastName, email) {
        return await super.createUserProfile(WebUserModel, uid, firstName, lastName, email);
    }

    static async getUserProfile(uid) {
        return await super.getUserProfile(WebUserModel, uid);
    }

    static async updateUserProfile(uid, firstName, lastName, email) {
        return await super.updateUserProfile(WebUserModel, uid, firstName, lastName, email);
    }

    static async deleteUserProfile(uid) {
        return await super.deleteUserProfile(WebUserModel, uid);
    }

    static async addPatient(uid, patientUID) {
        // Instead of rewriting this function, getting the patient profile to confirm the patient exists
        const patient = await AppUserModel.getUserProfile(patientUID);
        if (patient) await WebUserModel.addPatient(uid, patientUID);
        else return null;
    }

    static async getPatients(uid, patientUID) {
        let patients = [];
        const patientUIDs = await WebUserModel.getPatients(uid);
        if (patientUIDs){
            for (p of patientUIDs) {
                let patient = await AppUserModel.getUserProfile(uid);
                let patientSummary = {
                    firstName: patient.profile.firstName,
                    lastName: patient.profile.lastName,
                    dateOfBirth: patient.profile.dateOfBirth,
                    averageRisk: patient.results.averageRisk,
                    questionnaireAverageRisk: patient.results.questionnaireAverageRisk,
                    voiceAverageRisk: patient.results.voiceAverageRisk, 
                }
                patients += patientSummary;
            }
        } else return null;
        return patients;
    }
}

export default WebUserService;