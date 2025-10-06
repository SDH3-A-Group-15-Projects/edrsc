const ErrorConsts = {
    firstNameValidationError: {
        message: "First Name must not be blank and can only contain letters, dashes or spaces.",
        errorStatus: 400
    },

    lastNameValidationError: {
        message: "Last Name must not be blank and can only contain letters, dashes or spaces.",
        errorStatus: 400
    },

    emailValidationError: {
        message: "Email Address is invalid.",
        errorStatus: 400
    },

    profileCreationError: {
        message: "Failed to create profile.",
        errorStatus: 500
    }
};

export default ErrorConsts;