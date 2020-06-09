const router = require('express-promise-router')();
const UsersController = require('../controllers/users');
const { validateBody, schemas } = require('../middlewares/authValidator');
const { googleVerify } = require('../middlewares/googleVerify');
const passport = require('passport');
const passportConf = require('../passport');

const { localAuthenticate, jwtAuthenticate } = require('../middlewares/passportCallback');

router.route('/signup')
    .post(validateBody(schemas.signUpSchema), UsersController.signUp);

router.route('/signin')
    .post(validateBody(schemas.signInSchema), localAuthenticate(), UsersController.signIn);

router.route('/oauth/google')
    .post(UsersController.googleOAuth);

router.route('/signout')
    .post(UsersController.signOut);

router.route('/changepassword')
    .post(UsersController.changePassword);

router.route('/getnewtoken')
    .get(UsersController.getNewToken);

router.route('/checkuser')
    .get(UsersController.checkUserRefToken);

router.route('/checkAccount')
    .get(UsersController.checkAccount);

router.route('/secret')
    .get(jwtAuthenticate(), UsersController.secret);

module.exports = router;
