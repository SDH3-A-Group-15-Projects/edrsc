import express from 'express';
import WebUserController from '../../controllers/webUserController.js';
import authenticateToken from '../../middleware/authenticateToken.js';

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

// dateOfBirth fields are redundant for Doctor profiles, any value will be accepted.

/**
 * Get User Profile
 * 
 * Requires Authentication
 * URL: /api/web/users/:uid/profile
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
router.get('/:uid/profile', authenticateToken, WebUserController.getUserProfile);

/**
 * Create User Profile
 * 
 * Requires Authentication
 * URL: /api/web/users/:uid/profile
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
router.post('/:uid/profile', authenticateToken, WebUserController.createUserProfile);

/**
 * Update User Profile
 * 
 * Requires Authentication
 * URL: /api/web/users/:uid/profile
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
router.put('/:uid/profile', authenticateToken, WebUserController.updateUserProfile);

/**
 * Delete User Profile
 * 
 * Requires Authentication
 * URL: /api/web/users/:uid/profile
 * @param req
 * Method: DELETE
 * Body: None
 * @returns
 * On Success: 204 "User profile successfully deleted."
 * On Failure: 404 "User Profile not found."
 * 500
 */
router.delete('/:uid/profile', authenticateToken, WebUserController.deleteUserProfile);

/**
 * Add Patient
 * 
 * Requires Authentication
 * URL: /api/web/users/:uid/patients/:patientuid
 * @param req
 * Method: POST
 * Body: None
 * @returns
 * On Success: 201 "Added patient with UID 1"
 * On Failure: 400 "No Patient UID specified."
 * 404 "No patient found with UID 1"
 * 500
 */
router.post('/:uid/patients/:patientuid', authenticateToken, WebUserController.addPatient);

/**
 * Get Patients For User
 * 
 * Requires Authentication
 * URL: /api/web/users/:uid/patients/
 * @param req
 * Method: GET
 * Body: None
 * @returns
 * On Success: 200
 * Body: [
 *      {
            firstName: string,
            lastName: string,
            dateOfBirth: string,
            averageRisk: float,
            questionnaireAverageRisk: float,
            voiceAverageRisk: float, 
 *      },
 *      ...
 *  ]
 * On Failure: 404 "Patients not found"
 * 500
 */
router.get('/:uid/patients/', authenticateToken, WebUserController.getPatients);

/**
 * Get All Unregistered Patients
 * 
 * Requires Authentication
 * URL: /api/web/users/patients/
 * @param req
 * Method: GET
 * Body: None
 * @returns
 * On Success: 200
 * Body: [
 *      {
            firstName: string,
            lastName: string,
            dateOfBirth: string,
            averageRisk: float,
            questionnaireAverageRisk: float,
            voiceAverageRisk: float, 
 *      },
 *      ...
 *  ]
 * On Failure: 404 "Patients not found"
 * 500
 */
router.get('/:uid/unregistered/', authenticateToken, WebUserController.getAllUnregisteredPatients);

/**
 * Delete Patient
 * 
 * Requires Authentication
 * URL: /api/web/users/:uid/patients/:patientuid
 * @param req
 * Method: DELETE
 * Body: None
 * @returns
 * On Success: 204 "Removed patient with UID 1"
 * On Failure: 400 "No patient UID specified."
 * 404 "No patient found with UID 1"
 * 500
 */
router.delete('/:uid/patients/:patientuid', authenticateToken, WebUserController.removePatient);

/**
 * Generate Report for Patient
 * 
 * Requires Authentication
 * URL: /api/web/users/:uid/patients/report/:patientuid
 * @param req
 * Method: GET
 * Body: None
 * @returns
 * On Success: 200
 * Body: {
            profile: {
                firstName: string,
                lastName: string,
                dateOfBirth: string
            },
            riskFactors: {
                isSmoking: boolean,
                isDiabetic: boolean,
                weeklyStandardUnitsAlcohol: float,
                weeklyHoursExercise: float,
                avgDailyHoursSleep: float,
            },
            results: {
                averageRisk: float,
                questionnaireAverageRisk: float,
                questionnaire: [
                    {
                        id: string,
                        q1: string,
                        q2: string,
                        ...
                        completionDate: string,
                        calculatedRisk: float
                    },
                    ...
                ],
                voiceAverageRisk: float,
                voice: [
                    {
                        id: string,
                        completionDate: string,
                        calculatedRisk: float
                    },
                    ...
                ]
            }
        }
 * On Failure: 404 "No patient found with UID 1"
 * 500
 */
router.get('/:uid/patients/report/:patientuid', authenticateToken, WebUserController.generateReport);

export default router;