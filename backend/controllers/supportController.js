import SupportService from "../services/supportService.js";

class SupportController {
    static async submitSupportRequest(req, res) {
        try {   
            const message = req.body;
            const uid = req.params.uid;
            const result = await SupportService.submitSupportRequest(uid, message);
            if (result) return res.status(201).json({id: result});
            else {
                res.status(500).send("No response from API");
            }
        } catch (e) {
            console.error(e.message);
            console.trace();
            res.status(500).send("No response from API");
        }
    }

    static async getAllSupportRequests(req, res) {
        try {   
            const requests = await SupportService.getAllSupportRequests();
            if (requests) return res.status(201).json(requests);
            else {
                res.status(404).send("Support requests not found");
            }
        } catch (e) {
            console.error(e.message);
            console.trace();
            res.status(500).send("No response from API");
        }
    }
}

export default SupportController;