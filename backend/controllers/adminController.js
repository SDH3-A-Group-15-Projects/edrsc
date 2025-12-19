import AdminService from "../services/adminService.js";

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

    static async getAllRatings(req, res) {
        try {   
            const ratings = await AdminService.getAllRatings();
            if (ratings) return res.status(201).json(ratings);
            else {
                res.status(404).send("Ratings not found");
            }
        } catch (e) {
            console.error(e.message);
            console.trace();
            res.status(500).send("No response from API");
        }
    }
}

export default AdminController;