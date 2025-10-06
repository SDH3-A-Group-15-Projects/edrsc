import UserService from "./userService";
import AppUserModel from "../models/appUserModel";

class AppUserService extends UserService {
    static async createUserProfile(uid, firstName, lastName, email) {
        return await super.createUserProfile(AppUserModel, uid, firstName, lastName, email);
    }

    static async getUserProfile(Model, uid) {
        return await super.getUserProfile(AppUserModel, uid);
    }

    static async updateUserProfile(Model, uid, profileDataUpdate) {
        return await super.updateUserProfile(AppUserModel, uid, profileDataUpdate);
    }

    static async deleteUserProfile(Model, uid) {
        return await super.deleteUserProfile(AppUserModel, uid);
    }
}

export default AppUserService;