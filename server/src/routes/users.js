const router = require('express-promise-router')();
const UsersController = require('../controllers/users');
const { validateBody, schemas } = require('../middlewares/authValidator');
const passport = require('passport');
const passportConf = require('../passport');

router.route('/signup')
    .post(validateBody(schemas.signUpSchema), UsersController.signUp);

router.route('/signin')
    .post(validateBody(schemas.signInSchema), passport.authenticate('local', { session: false }), validateBody(schemas.signInSchema), UsersController.signIn);

router.route('/oauth/google')
    .post(passport.authenticate('googleToken', { session: false }), UsersController.googleOAuth);

router.route('/signout')
    .post(UsersController.signOut);

router.route('/getnewtoken')
    .post(UsersController.getNewToken);

module.exports = router;
