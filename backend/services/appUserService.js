import UserService from "./userService.js";
import AppUserModel from "../models/appUserModel.js";

class AppUserService extends UserService {
    static async createUserProfile(uid, firstName, lastName, email, dateOfBirth) {
        /*const details = {
            riskFactors: {},
            results: {
                questionnaire: {},
                voice: {},
                test: {}
            },
            conversations: {},
        }*/

        const createdProfile = await super.createUserProfile(AppUserModel, uid, firstName, lastName, email, dateOfBirth);
        // if (createdProfile) await AppUserModel.createPatientData(uid, details);
        return createdProfile;
    }

    static async getUserProfile(uid) {
        const patient = await super.getUserProfile(AppUserModel, uid);
        return patient.profile;
    }

    static async updateUserProfile(uid, firstName, lastName, email, dateOfBirth) {
        return await super.updateUserProfile(AppUserModel, uid, firstName, lastName, email, dateOfBirth);
    }

    static async deleteUserProfile(uid) {
        return await super.deleteUserProfile(AppUserModel, uid);
    }

    static async updateUserResults(uid, results) {
        return await AppUserModel.updateUserResults(uid, results);
    }

    static async recalculateAvgRisk(uid) {
        let profile = await this.getUserProfile(uid);
        let results = profile.results;

        let qRisk = 0;
        let qCount = 0;
        let vRisk = 0;
        let vCount = 0;
        let avgRisk = 0;

        for (q of results.questionnaire) {
            qRisk += q.calculatedRisk;
            qCount++;
        }

        for (v of results.voice) {
            vRisk += v.calculatedRisk;
            vCount++;
        }

        if (qCount > 0) qRisk = qRisk / qCount;
        if (vCount > 0) vRisk = vRisk / vCount;
        avgRisk = (qRisk + vRisk) / 2;
        
        results.questionnaireAverageRisk = qRisk;
        results.voiceAverageRisk = vRisk;
        results.averageRisk = avgRisk;

        return results;
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

        questionnaire.completionDate = new Date().toISOString();
        await AppUserModel.submitQuestionnaire(uid, questionnaire);

        const newResults = await this.recalculateAvgRisk(uid);
        // If this does not return null
        if (await this.updateUserResults(uid, newResults)) return questionnaire;
        else return null;
    }

    static async submitVoice(uid, voice) {
        try {
            let voiceResult = {
                calculatedRisk: 0,
            }

            const form = new FormData();
            form.append("audioInput", voice.buffer, {
                filename: voice.originalname,
                contentType: voice.mimetype
            });

            const aiResponse = await fetch("http://localhost:3002/voice", {
                method: "POST",
                headers: {
                    ...form.getHeaders(),
                },
                body: form,
                
            })
            .then(response => response.json())
            .then(data => voice.calculatedRisk = data.calculatedRisk)
            .catch(error => console.error("Error:", error));

            voice.completionDate = new Date().toISOString();
            await AppUserModel.submitVoice(uid, voiceResult);

            const newResults = await this.recalculateAvgRisk(uid);
            // If this does not return null
            if (await this.updateUserResults(uid, newResults)) return voiceResult;
            else return null;
        }
        catch (e) {
            return null;
        }
    }

    static async submitRiskFactors(uid, riskFactors) {
        await fetch("http://localhost:3002/riskfactors", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(riskFactors)
        })
        .catch(error => console.error("Error:", error));

        await AppUserModel.submitRiskFactors(uid, riskFactors);
    }
}

export default AppUserService;