const router = require('express').Router();

const delBox = require('../controllers/delBox');
const getBoxData = require('../controllers/boxes');
const changeLevel = require('../controllers/changeLevel');
const downloadEmails = require('../controllers/downloadEmails');
const delMail = require('../controllers/delMail');
const getMails = require('../controllers/getMails');
const getMail = require('../controllers/getMail');
const changeFolder = require('../controllers/changeFolder');
const addMailToBlacklist = require('../controllers/addMailToBlacklist');
const getMailsFromBlacklist = require('../controllers/getMailsFromBlacklist');
const delMailFromBlacklist = require('../controllers/delMailFromBlacklist');
const addWordToBlacklist = require('../controllers/addWordToBlacklist');
const getWordsFromBlacklist = require('../controllers/getWordsFromBlacklist');

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

router.get('/getmail', getMail);

router.put('/changefolder', changeFolder);

router.post('/addmailtoblacklist', addMailToBlacklist);

router.get('/getmailsfromblacklist', getMailsFromBlacklist);

router.delete('/delmailfromblacklist', delMailFromBlacklist);

router.post('/addwordtoblacklist', addWordToBlacklist);

router.get('/getwordsfromblacklist', getWordsFromBlacklist);

module.exports = router;
