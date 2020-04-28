const router = require('express').Router();

const delBox = require('../controllers/delBox');
const getBoxData = require('../controllers/boxes');
const changeLevel = require('../controllers/changeLevel');

router.use('/imap', require('../routes/imap'));
router.use('/pop3', require('../routes/pop3'));

router.delete('/del', delBox, () => {
    res.json({ success: res.locals.success, msg: res.locals.msg })
});

router.get('/boxes', getBoxData);

router.post('/changelevel', changeLevel);

module.exports = router;
