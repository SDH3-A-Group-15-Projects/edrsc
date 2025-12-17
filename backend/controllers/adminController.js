import AdminService from "../services/adminService.js";
import WebUserService from "../services/webUserService.js";

class AdminController {
    static async exportAnonymisedData(req, res) {
        try {   
            const patients = await AdminService.exportAnonymisedData();
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

    static async getAllDoctors(req, res) {
        try {   
            const doctors = await AdminService.getAllDoctors();
            if (doctors) return res.status(201).json(doctors);
            else {
                res.status(404).send("Doctors not found");
            }
        } catch (e) {
            console.error(e.message);
            console.trace();
            res.status(500).send("No response from API");
        }
    }
}

export default AdminController;