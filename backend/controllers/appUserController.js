import UserController from "./userController.js";
import AppUserService from "../services/appUserService.js";

class AppUserController extends UserController {
    static async createUserProfile(req, res) {
        return await super.createUserProfile(AppUserService, req, res);
    }

    static async getUserProfile(req, res) {
        return await super.getUserProfile(AppUserService, req, res);
    }

    static async updateUserProfile(req, res) {
        return await super.updateUserProfile(AppUserService, req, res);
    }

    static async deleteUserProfile(req, res) {
        return await super.deleteUserProfile(AppUserService, req, res);
    }
}

export default AppUserController;