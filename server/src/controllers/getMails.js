const User = require('../models/users');
const jwt = require('jsonwebtoken');

async function getMails (req, res, next) {
    
    if (!req.query.folder) {
        return res.json({
            success: 0,
            msg: 'Brak numeru folderu'
        }); 
    }

    if (!req.query.user) {
        jwt.verify(req.header('authorization'), process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                return res.json({ success: -1 });
            } else {
                req.userId = decodedToken.sub;

                const foundUser = await User.findOne({
                    '_id':req.userId
                }, 'mailBoxes');

                if (foundUser) {
                    let promises = [];
                    for (let i = 0; i < foundUser.mailBoxes.length; i++) {
                        for (j = 0; j < foundUser.mailBoxes[i].mails.length; j++) {
                            if (foundUser.mailBoxes[i].mails[j].folder == req.query.folder) {
                                promises.push(pushMails(foundUser, i, j));
                            }
                        }
                    }
                    Promise.all(promises).then((mails) => {
                        return res.json({
                            success: 1,
                            mails: mails
                        });
                    });
                }
            }
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
        return res.json({
            success: 1,
            mails: mails
        });
    });
}

async function pushMails(foundUser, i, j) {
    return new Promise((resolve) => {
        mails.push(foundUser.mailBoxes[i].mails[j])
        console.log(foundUser.mailBoxes[i].user)
        return resolve(mails)
    });
}

module.exports = getMails;
