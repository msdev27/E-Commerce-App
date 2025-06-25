const { validationResult } = require('express-validator');

module.exports = {
    handleErrors(tempFunc, dataCb) {
        return async (req, res, next) => {
            const errors = validationResult(req);
            let data= {};
            if (!errors.isEmpty()) {
                if (dataCb) {
                    data = await dataCb(req);
                }
                return res.send(tempFunc({ errors, ...data }));
            }
            next();
        }
    },
    requireAuth(req, res, next) {
        if (!req.session.userId) {
            return res.redirect('/signin');
        }
        next();
    }
}