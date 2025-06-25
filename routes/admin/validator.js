const {check} = require("express-validator");
const userRepository = require("../../repository/users");


module.exports = {
    requireEmail: check('email').trim().normalizeEmail().isEmail().withMessage('Must be a valid email address')
        .custom(async (email) => {
            const existingUser = await userRepository.getOneBy({email: email})
            if (existingUser) {
                throw new Error ('Email already exist');
            }
        }),
    requirePassword: check('password').trim().isLength({min:6, max:25})
        .withMessage('Must be between 4 and 20 characters'),
    requirePasswordConfirmation: check('passwordConfirmation').trim().isLength({min:6, max:25})
        .custom(async (passwordConfirmation, {req}) => {
            if (passwordConfirmation !== req.body.password) {
                throw new Error ('Passwords do not match');
            }
        }),
    requireEmailExists: check('email').trim().normalizeEmail().isEmail().withMessage('Must be a valid email address')
        .custom(async (email) => {
            const existingUser = await userRepository.getOneBy({email: email})
            if (!existingUser) {
                throw new Error('Email not found');
            }
        }),
    requireValidPasswordForSignInUser: check('password').trim().isLength({min:6, max:25})
        .custom( async (password, {req}) => {
            const existingUser = await userRepository.getOneBy({email: req.body.email});

            if (!existingUser) {
                throw new Error('Invalid Password');
            //     Since valid email is already checked for and would throw an error in the appropriate section, this
            //     check is exclusively for password and throwing an error saying email not found in the password block
            //     does not make sense, so we throw Invalid Password
            }

            const passwordsMatch = await userRepository.comparePasswords(existingUser.password, password);

            if (!passwordsMatch) {
                throw new Error('Invalid Password!');
            }
        }),
    requireValidProductName: check('productName').trim().isLength({min:6, max:25})
        .withMessage('Title length must be between 6 and 25'),
    requireValidProductPrice: check('productPrice').trim().toFloat().isFloat()
        .withMessage('Must be a valid number')

}