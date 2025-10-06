import UserService from "./userService";
import WebUserModel from "../models/webUserModel";

class WebUserService extends UserService {
    static async createUserProfile(uid, firstName, lastName, email) {
        return await super.createUserProfile(WebUserModel, uid, firstName, lastName, email);
    }

    static async getUserProfile(Model, uid) {
        return await super.getUserProfile(WebUserModel, uid);
    }

    static async updateUserProfile(Model, uid, profileDataUpdate) {
        return await super.updateUserProfile(WebUserModel, uid, profileDataUpdate);
    }

    static async deleteUserProfile(Model, uid) {
        return await super.deleteUserProfile(WebUserModel, uid);
    }
}

export default WebUserService;