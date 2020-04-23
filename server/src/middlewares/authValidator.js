const Joi = require('joi');

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema);
            if (result.error) {
                return res.json(result.error);
            }

            if (!req.value) { req.value = {}; }
            req.value['body'] = result.value;
            next();
        }
    },

    schemas: {
        signUpSchema: Joi.object().keys({
            username: Joi.string().required().error(() => {
                return {
                    message: 'Nieprawidłowy login'
                };
            }),
            email: Joi.string().email().required().error(() => {
                return {
                    message: 'Nieprawidłowy email'
                };
            }),
            password: Joi.string().required().error(() => {
                return {
                    message: 'Nieprawidłowe hasło'
                };
            })
        }),

        signInSchema: Joi.object().keys({
            username: Joi.string().required(),
            password: Joi.string().required()
        })
    }
}
