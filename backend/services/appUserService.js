import UserService from "./userService.js";
import AppUserModel from "../models/appUserModel.js";

class AppUserService extends UserService {
    static async createUserProfile(uid, firstName, lastName, email) {
        return await super.createUserProfile(AppUserModel, uid, firstName, lastName, email);
    }

    static async getUserProfile(uid) {
        return await super.getUserProfile(AppUserModel, uid);
    }

    static async updateUserProfile(uid, firstName, lastName, email) {
        return await super.updateUserProfile(AppUserModel, uid, firstName, lastName, email);
    }

    static async deleteUserProfile(uid) {
        return await super.deleteUserProfile(AppUserModel, uid);
    }
}

export default AppUserService;