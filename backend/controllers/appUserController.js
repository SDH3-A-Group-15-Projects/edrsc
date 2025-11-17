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

    static async submitQuestionnaire(Service, req, res) {
        try {
            const questionnaire = req.body;

            for (q in questionnaire) {
                if (questionnaire[q] == "") return res.status(400).send("All questions must be answered.");
            }

            const result = await Service.submitQuestionnaire(uid, questionnaire);
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