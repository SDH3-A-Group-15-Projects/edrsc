import UserService from "./userService.js";
import AppUserModel from "../models/appUserModel.js";

class AppUserService extends UserService {
    static async createUserProfile(uid, firstName, lastName, email) {
        const details = {
            riskFactors: {},
            results: {
                questionnaire: {},
                voice: {},
                test: {}
            },
            conversations: {},
        }

        return await super.createUserProfile(AppUserModel, uid, firstName, lastName, email, details);
    }

    static async getUserProfile(uid) {
        return await super.getUserProfile(AppUserModel, uid);
    }

    static async updateUserProfile(uid, firstName, lastName, email) {
        return await super.updateUserProfile(AppUserModel, uid, firstName, lastName, email);
    }

    static async deleteUserProfile(uid) {
        return await super.deleteUserProfile(AppUserModel, uid);
    }

    static async submitQuestionnaire(uid, questionnaire) {
        await fetch("http://localhost:3002/questionnaire", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(questionnaire)
        })
        .then(response => response.json())
        .then(data => questionnaire.calculatedRisk = data.calculatedRisk)
        .catch(error => console.error("Error:", error));

        return await super.submitQuestionnaire(AppUserModel, uid, questionnaire);
    }
}

export default AppUserService;