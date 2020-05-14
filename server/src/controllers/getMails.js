const User = require('../models/users');
const jwt = require('jsonwebtoken');

async function getMails (req, res, next) {
    if (!req.query.user) {
        return res.json({
            success: 0,
            msg: 'Brak adresu skrzynki'
        });
    }

    if (!req.query.folder) {
        return res.json({
            success: 0,
            msg: 'Brak numeru folderu'
        }); 
    }

    console.log(req.query.user);
    console.log(req.query.folder);

    jwt.verify(req.header('authorization'), process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
            return res.json({ success: -1 });
        } else {
            req.userId = decodedToken.sub;

            mails = new Array();


            const foundUser = await User.findOne({
                '_id':req.userId,
                'mailBoxes.user': req.query.user
            }, 'mailBoxes.$');
            
            if (foundUser) {
                for (j = 0; j < foundUser.mailBoxes[0].mails.length; j++) {
                    if (foundUser.mailBoxes[0].mails[j].folder == req.query.folder) {
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
