class UserController {
    static async createUserProfile(Service, req, res) {
        try {
            const { firstName, lastName } = req.body;
            const uid = req.user.uid;
            const email = req.user.email;

            const newUserProfile = await Service.createUserProfile(uid, firstName, lastName, email);
            res.status(201).json(newUserProfile);
        } catch (e) {
            console.error(e.message);
            if (res.status) return res.status(e.status).send(e.message);
            else return res.status(500).send(e.message);
        }
    }

    static async getUserProfile(Service, req, res) {
        try {
            const userProfile = await Service.getUserProfile(uid);
            if (userProfile) res.status(200).json(userProfile);
            else res.status(404).send("User Profile not found.");
        } catch (e) {
            console.error(e.message);
            if (res.status) return res.status(e.status).send(e.message);
            else return res.status(500).send(e.message);
        }
    }

    static async updateUserProfile(Service, req, res) {
        try {
            const { firstName, lastName } = req.body;
            const uid = req.user.uid;
            const email = req.user.email;

            const profileDataUpdate = await Service.updateUserProfile(uid, firstName, lastName, email);
            res.status(200).json(profileDataUpdate);
        } catch (e) {
            console.error(e.message);
            if (res.status) return res.status(e.status).send(e.message);
            else return res.status(500).send(e.message);
        }
    }

    static async deleteUserProfile(Service, req, res) {
        try {
            if (await Service.deleteUserProfile(uid)) res.status(204).send("User profile successfully deleted.")
            else res.status(404).send("User Profile not found.");
        } catch (e) {
            console.error(e.message);
            if (res.status) return res.status(e.status).send(e.message);
            else return res.status(500).send(e.message);
        }
    }
}

export default UserController;