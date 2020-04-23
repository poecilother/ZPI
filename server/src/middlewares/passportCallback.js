const passport = require('passport');
const passportConf = require('../passport');

module.exports = {
    localAuthenticate: () => {
        return (req, res, next) => {
            passport.authenticate('local', { session: false }, (err, user, info) => {
                if (err) {
                    return res.json({
                        succes: 0
                    });
                }

                if (!user) {
                    return res.json({
                        success: 0,
                        msg: 'Niepoprawny login lub hasło'
                    });
                }
                req.user = user;
                next();
            })(req, res, next);
        }
    }
}
