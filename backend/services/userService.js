import ErrorConsts from "../consts/errorConsts";

class UserService {
    static validateUserProfileInputs(firstName, lastName, email) {
        const nameRegex = /^(?![- ])[a-z]*(?:[- ][a-z][a-z]*)*[^- ]$/im;
        const emailRegex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/g // Source: https://regex101.com/r/lHs2R3/1

        if (!firstName || firstName.trim() === '' || !nameRegex.test(firstName)) {
            throw new Error(ErrorConsts.firstNameValidationError.message);
        } else if (!lastName || lastName.trim() === '' || !nameRegex.test(lastName)) {
            throw new Error(ErrorConsts.lastNameValidationError.message);
        } else if (!email || email.trim() === '' || !emailRegex.test(email)) {
            throw new Error(ErrorConsts.emailValidationError.message);
        }
    }

    static async createUserProfile(Model, uid, firstName, lastName, email) {
        try {
            this.validateUserProfileInputs(firstName, lastName, email);
        } catch (e) {
            throw e;
        }

        const profileData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        createdAt: new Date().toISOString()
        };

        return await Model.createUserProfile(uid, profileData);
    }

    static async getUserProfile(Model, uid) {
        return await Model.getUserProfile(uid);
    }

    static async updateUserProfile(Model, uid, profileDataUpdate) {
        try {
            this.validateUserProfileInputs(firstName, lastName, email);
        } catch (e) {
            throw e;
        }

        return await Model.updateUserProfile(uid, profileDataUpdate);
    }

    static async deleteUserProfile(Model, uid) {
        return await Model.deleteUserProfile(uid);
    }
}

export default UserService;
