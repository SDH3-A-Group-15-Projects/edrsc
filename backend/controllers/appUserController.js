import UserController from "./userController.js";
import AppUserService from "../services/appUserService.js";

class AppUserController extends UserController {
    static async createUserProfile(req, res) {
        return await super.createUserProfile(AppUserService, req, res);
    }

    static async getUserProfile(req, res) {
        return await super.getUserProfile(AppUserService, req, res);
    }

    static async updateUserProfile(req, res) {
        return await super.updateUserProfile(AppUserService, req, res);
    }

    static async deleteUserProfile(req, res) {
        return await super.deleteUserProfile(AppUserService, req, res);
    }

    static async submitQuestionnaire(req, res) {
        try {
            const questionnaire = req.body;

            for (q in questionnaire) {
                if (questionnaire[q] == "") return res.status(400).send("All questions must be answered.");
            }

            const result = await AppUserService.submitQuestionnaire(req.user.uid, questionnaire);
            res.status(201).json(result);
        } catch (e) {
            console.error(e.message);
            console.trace();
            if (res.status) return res.status(res.status).send(e.message);
            else return res.status(500).send(e.message);
        }
    }

    static async submitVoice(req, res) {
        try {
            const voice = req.file;
            if (!voice) {
                const errMsg = "No Audio File Found after Upload";
                console.error(errMsg);
                console.trace();
                return res.status(400).send(errMsg);
            }
            const result = await AppUserService.submitVoice(req.user.uid, voice);
            if (result) res.status(201).json(result);
            else throw("No response from API");
        } catch (e) {
            console.error(e.message);
            console.trace();
            if (res.status) return res.status(res.status).send(e.message);
            else return res.status(500).send(e.message);
        }
    }

    static async submitRiskFactors(req, res) {
        try {
            const riskFactors = req.body;

            for (q in riskFactors) {
                if (!riskFactors[q]) return res.status(400).send("All risk factors must be answered.");
            }

            const result = await AppUserService.submitRiskFactors(req.user.uid, riskFactors);
            res.status(201).json(result);
        } catch (e) {
            console.error(e.message);
            console.trace();
            if (res.status) return res.status(res.status).send(e.message);
            else return res.status(500).send(e.message);
        }
    }
}

export default AppUserController;