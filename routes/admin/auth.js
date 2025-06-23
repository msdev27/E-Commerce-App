const express = require('express');
const { validationResult} = require('express-validator');
const userRepository = require('../../repository/users');
const signupTemplate = require('../../views/admin/auth/signup.js');
const signinTemplate = require('../../views/admin/auth/signin.js');
const {requireEmail,
    requirePassword,
    requirePasswordConfirmation,
    requireEmailExists,
    requireValidPasswordForSignInUser} = require('./validator.js');

const router = express.Router();

router.get('/signup', (req, res) => {
    console.log("get call");
    res.send(signupTemplate({req}));
});

router.post('/signup', [requireEmail, requirePassword, requirePasswordConfirmation],
    async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.send(signupTemplate({req, errors}));
    }

    const newUser = await userRepository.create(req.body);
    req.session.userId = newUser.id;
    res.send(`Successfully signed up`);
});

router.get('/signin', (req, res) => {
    res.send(signinTemplate({}));
});

router.post('/signin', [
        requireEmailExists,
        requireValidPasswordForSignInUser
    ],
    async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.send(signinTemplate({errors}));
    }

    const {email} = req.body;
    const existingUser = await userRepository.getOneBy({email: email});
    req.session.userId = existingUser.id;

    res.send(`Successfully logged in`);
});

router.get('/signout', (req, res) => {
    req.session = null;
    res.send('User logged out');
});

module.exports = router;