const router = require('express-promise-router')();
const UsersController = require('../controllers/users');
const { validateBody, schemas } = require('../middlewares/authValidator');
const { googleVerify } = require('../middlewares/googleVerify');
const passport = require('passport');
const passportConf = require('../passport');

const { localAuthenticate } = require('../middlewares/passportCallback');

router.route('/signup')
    .post(validateBody(schemas.signUpSchema), UsersController.signUp);

router.route('/signin')
    .post(validateBody(schemas.signInSchema), localAuthenticate(), UsersController.signIn);

router.route('/oauth/google')
    .post(UsersController.googleOAuth);

router.route('/signout')
    .post(UsersController.signOut);

router.route('/getnewtoken')
    .post(UsersController.getNewToken);

router.route('/secret')
    .get(passport.authenticate('jwt', { session: false }), UsersController.secret);

module.exports = router;
