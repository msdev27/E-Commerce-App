module.exports = {
    getErrors(errors, prop) {
        try {
            return errors.mapped()[prop].msg;
        } catch (e) {}
        return '';
    }
};