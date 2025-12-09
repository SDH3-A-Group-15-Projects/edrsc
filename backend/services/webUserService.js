import UserService from "./userService.js";
import WebUserModel from "../models/webUserModel.js";
import AppUserModel from "../models/appUserModel.js";


class WebUserService extends UserService {
    static async createUserProfile(uid, firstName, lastName, email) {
        const createdProfile = await super.createUserProfile(WebUserModel, uid, firstName, lastName, email, "1970-01-01");
        // if (createdProfile) await WebUserModel.createDoctorData(uid, {patients: []});
        return createdProfile;
    }

    static async getUserProfile(uid) {
        return await super.getUserProfile(WebUserModel, uid);
    }

    static async updateUserProfile(uid, firstName, lastName, email) {
        return await super.updateUserProfile(WebUserModel, uid, firstName, lastName, email, "1970-01-01");
    }

    static async deleteUserProfile(uid) {
        return await super.deleteUserProfile(WebUserModel, uid);
    }

    static async addPatient(uid, patientUID) {
        // Instead of rewriting this function, getting the patient profile to confirm the patient exists
        const patient = await AppUserModel.getUserProfile(patientUID);
        if (patient) return await WebUserModel.addPatient(uid, patientUID);
        else return null;
    }

    static async getPatients(uid) {
        try {
            const patients = [];
            const patientUIDs = await WebUserModel.getPatients(uid);
            console.log("Patient UIDs:", patientUIDs);
            if (patientUIDs && patientUIDs.length > 0) {
                for (const p of patientUIDs) {
                    const patient = await AppUserModel.getUserProfile(p);
                    if (!patient || !patient.profile) continue;
                    const patientSummary = {
                        firstName: patient.profile.firstName,
                        lastName: patient.profile.lastName,
                        dateOfBirth: patient.profile.dateOfBirth,
                        averageRisk: patient.results ? patient.results.averageRisk || null : null,
                        questionnaireAverageRisk: patient.results ? patient.results.questionnaireAverageRisk || null : null,
                        voiceAverageRisk: patient.results ? patient.results.voiceAverageRisk || null : null, 
                    }
                    patients.push(patientSummary);
                }
            } else return null;
            return patients;
        } catch (e) {
            console.trace();
            console.error(e.message);
            throw e;
        }
    }

    static async removePatient(uid, patientUID) {
        return await WebUserModel.removePatient(uid, patientUID);
    }

    static async generateReport(patientUID) {
        const patient = await AppUserModel.getUserProfile(patientUID);
        if (patient && patient.profile) {
            return {
                profile: {
                    firstName: patient.profile.firstName,
                    lastName: patient.profile.lastName,
                    dateOfBirth: patient.profile.dateOfBirth
                },
                riskFactors: patient.riskFactors,
                results: patient.results
            }
        }
        else return null;
    }
}

export default WebUserService;