const express = require('express');
const router = express.Router();

const addBoxPop3 = require('../controllers/addBoxPop3.js');

router.get('/', function (req, res) {
 
});

router.post('/add', addBoxPop3, function (req, res) {
    res.json({ success: res.locals.success, msg: res.locals.msg })
});

module.exports = router;