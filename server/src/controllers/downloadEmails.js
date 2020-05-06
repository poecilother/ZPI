const User = require('../models/users');
const jwt = require('jsonwebtoken');
const downloadEmailsImap = require('../middlewares/downloadEmailsImap');
const downloadEmailsPop3 = require('../middlewares/downloadEmailsPop3');

async function downloadEmails (req, res) {
    jwt.verify(req.header('authorization'), process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
            return res.json({ success: -1 });
        } else {
            req.userId = decodedToken.sub;
        }
    });

    const foundUser = await User.findOne({ 
        '_id':req.userId,
        'mailBoxes.user': req.body.user
    }, 'mailBoxes.$');

    if (foundUser) {
        let userData = {
            user: foundUser.mailBoxes[0].user,
            password: foundUser.mailBoxes[0].password
        };
        if(foundUser.mailBoxes[0].protocol == 'imap'){
            downloadEmailsImap(userData).then(emails => {
                return res.json(emails);
            });
        } else {
            console.log('Pop3');
            downloadEmailsPop3(userData).then(emails => {
                console.log(emails)
                return res.json(emails);
            });
        }
    } else {
        return res.json({
            success: 0,
            msg: 'Brak skrzynek'
        });
    }
}

module.exports = downloadEmails
