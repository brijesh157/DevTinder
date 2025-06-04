const validator = require("validator");

const validateSignUpData = (data) => {
    const firstName = data.firstName;
    const emailID = data.emailId;
    const password = data.password;

    if (!validator.isEmail(emailID)) {
        throw new Error("Invalid Email");
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong");
    }
    if (firstName.length < 3 || firstName.length > 15) {
        throw new Error("First Name is not valid");
    }
}

module.exports = { validateSignUpData };