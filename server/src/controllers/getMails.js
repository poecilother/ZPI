const User = require('../models/users');
const jwt = require('jsonwebtoken');

async function getMails (req, res, next) {
    if (!req.body.user) {
        return res.json({
            success: 0,
            msg: 'Brak adresu skrzynki'
        });
    }

    if (!req.body.folder) {
        return res.json({
            success: 0,
            msg: 'Brak numeru folderu'
        }); 
    }

    jwt.verify(req.header('authorization'), process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
            return res.json({ success: -1 });
        } else {
            req.userId = decodedToken.sub;

            mails = new Array();


            const foundUser = await User.findOne({
                '_id':req.userId,
                'mailBoxes.user': req.body.user
            }, 'mailBoxes.$');
            
            if (foundUser) {
                for (j = 0; j < foundUser.mailBoxes[0].mails.length; j++) {
                    if (foundUser.mailBoxes[0].mails[j].folder == req.body.folder) {
                        mails.push(foundUser.mailBoxes[0].mails[j])
                    }
                }
            }
            
        }
        res.json({
            success: 1,
            mails: mails
        });
    });
}

module.exports = getMails;
