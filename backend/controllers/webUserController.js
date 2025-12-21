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

    static async addPatient(req, res) {
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
                res.status(404).send("No patient found with UID " + patientUID);
            }
        } catch (e) {
            console.error(e.message);
            console.trace();
            res.status(500).send("No response from API");
        }
    }

    static async getPatients(req, res) {
        try {
            const uid = req.user.uid;
            const patients = await WebUserService.getPatients(uid);
            if (patients) return res.status(201).json(patients);
            else {
                res.status(404).send("Patients not found");
            }
        } catch (e) {
            console.error(e.message);
            console.trace();
            res.status(500).send("No response from API");
        }
    }

    static async getAllUnregisteredPatients(req, res) {
        try {
            const uid = req.user.uid;
            const patients = await WebUserService.getAllUnregisteredPatients(uid);
            if (patients) return res.status(201).json(patients);
            else {
                res.status(404).send("Patients not found");
            }
        } catch (e) {
            console.error(e.message);
            console.trace();
            res.status(500).send("No response from API");
        }
    }

    static async removePatient(req, res) {
        try {
            const patientUID = req.params.patientuid;
            const uid = req.user.uid;

            if (!patientUID) {
                res.status(400);
                throw("No Patient UID specified.");
            }

            const deletedUID = await WebUserService.removePatient(uid, patientUID);
            if (deletedUID) return res.status(201).send(`Removed patient with UID ${deletedUID}`);
            else {
                res.status(404).send("No patient found with UID " + patientUID);
            }
        } catch (e) {
            console.error(e.message);
            console.trace();
            res.status(500).send("No response from API");
        }
    }

    static async generateReport(req, res) {
        try {
            const patientUID = req.params.patientuid;

            const report = await WebUserService.generateReport(patientUID);
            if (report) return res.status(201).json(report);
            else {
                res.status(404).send("No patient found with UID " + patientUID);
            }
        } catch (e) {
            console.error(e.message);
            console.trace();
            res.status(500).send("No response from API");
        }
    }
}

export default WebUserController;