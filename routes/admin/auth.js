const express = require('express');

const { handleErrors } = require('./middlewares');
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

router.post('/signup', [ requireEmail, requirePassword, requirePasswordConfirmation ],
    handleErrors(signupTemplate),
    async (req, res) => {
    const newUser = await userRepository.create(req.body);
    req.session.userId = newUser.id;
    res.redirect(`/admin/products`);
});

router.get('/signin', (req, res) => {
    res.send(signinTemplate({}));
});

router.post('/signin', [ requireEmailExists, requireValidPasswordForSignInUser ],
    handleErrors(signinTemplate),
    async (req, res) => {
    const {email} = req.body;
    const existingUser = await userRepository.getOneBy({email: email});
    req.session.userId = existingUser.id;
    res.redirect('/admin/products');
});

router.get('/signout', (req, res) => {
    req.session = null;
    res.send('User logged out');
});

module.exports = router;