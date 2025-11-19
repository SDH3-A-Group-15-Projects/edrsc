import UserController from "./userController.js";
import WebUserService from "../services/webUserService.js";

class WebUserController extends UserController {
    static async createUserProfile(req, res) {
        return await super.createUserProfile(WebUserService, req, res);
    }

    static async getUserProfile(req, res) {
        return await super.getUserProfile(WebUserService, req, res);
    }

    static async updateUserProfile(req, res) {
        return await super.updateUserProfile(WebUserService, req, res);
    }

    static async deleteUserProfile(req, res) {
        return await super.deleteUserProfile(WebUserService, req, res);
    }

    static async addPatient(Service, req, res) {
        try {
            const patientUID = req.params.patientuid;
            const uid = req.user.uid;

            if (!patientUID) {
                res.status(400);
                throw("No Patient UID specified.");
            }

            const addedUID = await WebUserService.addPatient(uid, patientUID);
            if (addedUID) return res.status(201).send(`Added patient with UID ${addedUID}`);
            else {
                res.status(404);
                throw("No patient found with UID", patientUID);
            }
        } catch (e) {
            console.error(e.message);
            console.trace();
            if (res.status) return res.status(res.status).send(e.message);
            else return res.status(500).send(e.message);
        }
    }

    static async getPatients(Service, req, res) {
        try {
            const uid = req.user.uid;
            const patients = await WebUserService.getPatients(uid);
            if (patients) return res.status(201).json(patients);
            else {
                res.status(404);
                throw("Patients not found");
            }
        } catch (e) {
            console.error(e.message);
            console.trace();
            if (res.status) return res.status(res.status).send(e.message);
            else return res.status(500).send(e.message);
        }
    }
}

export default WebUserController;