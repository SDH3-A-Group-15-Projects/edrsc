class UserController {
    static async createUserProfile(Service, req, res) {
        try {
            const { firstName, lastName, dateOfBirth } = req.body;
            const uid = req.user.uid;
            const email = req.user.email;

            console.log(uid, email, firstName, lastName, dateOfBirth);

            if (!firstName || !lastName) {
                return res.status(400).send("First and Last name is required.");
            }

            const newUserProfile = await Service.createUserProfile(uid, firstName, lastName, email, dateOfBirth);
            if (newUserProfile) res.status(201).json(newUserProfile);
            else res.status(500).send("No response from API");
        } catch (e) {
            console.error(e.message);
            console.trace();
            res.status(500).send("No response from API");
        }
    }

    static async getUserProfile(Service, req, res) {
        try {
            const userProfile = await Service.getUserProfile(req.user.uid);
            if (userProfile) res.status(200).json(userProfile);
            else res.status(404).send("User Profile not found.");
        } catch (e) {
            console.error(e.message);
            console.trace();
            if (res.status) return res.status(res.status).send(e.message);
            else return res.status(500).send(e.message);
        }
    }

    static async updateUserProfile(Service, req, res) {
        try {
            const { uid, firstName, lastName, dateOfBirth } = req.body;

            if (!firstName || !lastName) {
                return res.status(400).send("First and Last name is required.");
            }
            const profileDataUpdate = await Service.updateUserProfile(uid, firstName, lastName, dateOfBirth);
            if (profileDataUpdate) res.status(200).json(profileDataUpdate);
            else res.status(500).send("User Profile update failed.");
        } catch (e) {
            console.error(e.message);
            console.trace();
            res.status(500).send("No response from API");
        }
    }

    static async deleteUserProfile(Service, req, res) {
        try {
            if (await Service.deleteUserProfile(req.user.uid)) res.status(204).send("User profile successfully deleted.")
            else res.status(404).send("User Profile not found.");
        } catch (e) {
            console.error(e.message);
            console.trace();
            res.status(500).send("No response from API");
        }
    }
}

export default UserController;