import express from 'express';
import AppUserController from '../../controllers/appUserController.js';
import authenticateToken from '../../middleware/authenticateToken.js';
import handleAudioUpload from '../../middleware/handleAudioUpload.js';

const router = express.Router();

/*
    NOTE
================================================================================================
When using a route that Requires Authentication via Firebase include the following HTTP header:
    "Authorization": "Bearer idToken"

    Where idToken is the token returned from Firebase via the getIdToken method
------------------------------------------------------------------------------------------------
When using a route that expects JSON data include the following HTTP header:
    "Content-Type": "application/json"
------------------------------------------------------------------------------------------------
When using a route that expects MP3 data include the following HTTP header:
    "Content-Type": "multipart/form-data"
------------------------------------------------------------------------------------------------
*/

/**
 * Get User Profile
 * 
 * Requires Authentication
 * URL: /api/app/users/:uid/profile
 * @param req
 * Method: GET
 * Body: None
 * @returns
 * On Success: 200
 * Body: {
        firstName: string,
        lastName: string,
        email: string,
        dateOfBirth: string,
        createdAt: string,
        updatedAt: string
    }
 * On Failure: 404 "User Profile not found."
 * 500
 */
router.get('/:uid/profile', authenticateToken, AppUserController.getUserProfile);

/**
 * Create User Profile
 * 
 * Requires Authentication
 * URL: /api/app/users/:uid/profile
 * @param req
 * Method: POST
 * Body: {
 *      firstName: string,
 *      lastName: string,
 *      dateOfBirth: string
 * }
 * @returns
 * On Success: 201
 * Body: {
        firstName: string,
        lastName: string,
        email: string,
        dateOfBirth: string,
        createdAt: string,
        updatedAt: string
    }
 * On Failure: 400 "First and Last name is required."
 * 500
 */
router.post('/:uid/profile', authenticateToken, AppUserController.createUserProfile);

/**
 * Update User Profile
 * 
 * Requires Authentication
 * URL: /api/app/users/:uid/profile
 * @param req
 * Method: PUT
 * Body: {
 *      firstName: string,
 *      lastName: string,
 *      dateOfBirth: string
 * }
 * @returns
 * On Success: 200
 * Body: {
 *      firstName: string,
 *      lastName: string,
 *      dateOfBirth: string,
 *      email: string,
 *      createdAt: string,
 *      updatedAt: string
 *   }
 * On Failure: 400 "First and Last name is required."
 * 500
 */
router.put('/:uid/profile', authenticateToken, AppUserController.updateUserProfile);

/**
 * Delete User Profile
 * 
 * Requires Authentication
 * URL: /api/app/users/:uid/profile
 * @param req
 * Method: DELETE
 * Body: None
 * @returns
 * On Success: 204 "User profile successfully deleted."
 * On Failure: 404 "User Profile not found."
 * 500
 */
router.delete('/:uid/profile', authenticateToken, AppUserController.deleteUserProfile);

/**
 * Submit Questionnaire
 * 
 * Requires Authentication
 * URL: /api/app/users/:uid/results/questionnaire
 * @param req
 * Method: POST
 * Body: {
 *      q1: string,
 *      q2: string,
 *      ...
 * }
 * @returns
 * On Success: 201
 * Body: {
 *          id: string,
 *          q1: string,
 *          q2: string,
 *          ...
 *          completionDate: string,
 *          calculatedRisk: float
 *      }
 * On Failure: 400 "All questions must be answered."
 * 500 "No response from API"
 */
router.post('/:uid/results/questionnaire', authenticateToken, AppUserController.submitQuestionnaire);

/**
 * Submit Voice
 * 
 * Requires Authentication
 * URL: /api/app/users/:uid/results/voice
 * @param req
 * Method: POST
 * Body: FormData["audioFile"]
 * @returns
 * On Success: 201
 * Body: {
*           id: string,
*           completionDate: string,
*           calculatedRisk: float
*         },
 * On Failure: 400 "All questions must be answered."
 * 500 "No response from API"
 */
router.post('/:uid/results/voice/:id', authenticateToken, handleAudioUpload, AppUserController.submitVoice);

/**
 * Submit Risk Factors
 * 
 * Requires Authentication
 * URL: /api/app/users/:uid/results/riskfactors
 * @param req
 * Method: POST
 * Body: {
 *      q1: string,
 *      q2: string,
 *      ...
 * }
 * @returns
 * On Success: 201
 * Body: {
 *          isSmoking: boolean,
 *          isDiabetic: boolean,
 *          weeklyStandardUnitsAlcohol: float,
 *          weeklyHoursExercise: float,
 *          avgDailyHoursSleep: float,
 *      }
 * On Failure: 400 "All questions must be answered."
 * 500 "No response from API"
 */
router.post('/:uid/results/riskfactors', authenticateToken, AppUserController.submitRiskFactors);

router.post('/:uid/rating/', authenticateToken, AppUserController.submitAppRating);

/**
 * Submit Form Data
 * 
 * Requires Authentication
 * URL: /api/app/users/:uid/results/voice
 * @param req
 * Method: POST
 * Body: FormData["audioFile"]
 * FormData["questionnaire"]
 * FormData["riskFactors"]
 * @returns
 * On Success: 201
 * Body: {
*           id: string,
*           completionDate: string,
*           calculatedRisk: float
*         },
 * On Failure: 400 "All questions must be answered."
 * 500 "No response from API"
*/
//router.post('/:uid/results/', authenticateToken, handleAudioUpload, AppUserController.submitFormData);

export default router;