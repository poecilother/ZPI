const router = require('express').Router();

const delBox = require('../controllers/delBox');
const getBoxData = require('../controllers/boxes');
const changeLevel = require('../controllers/changeLevel');
const downloadEmails = require('../controllers/downloadEmails');
const delMail = require('../controllers/delMail');
const getMails = require('../controllers/getMails');

router.use('/imap', require('../routes/imap'));
router.use('/pop3', require('../routes/pop3'));

router.delete('/del', delBox, () => {
    res.json({ success: res.locals.success, msg: res.locals.msg })
});

router.get('/boxes', getBoxData);

router.post('/changelevel', changeLevel);

router.get('/downloademails', downloadEmails);

router.delete('/delmails', delMail);

router.get('/getmails', getMails);

module.exports = router;
