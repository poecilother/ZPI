const User = require('../models/users');
const jwt = require('jsonwebtoken');

async function addMailToBlacklist (req, res, next) {
    try {

        jwt.verify(req.header('authorization'), process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                return res.json({ success: -1 });
            } else {
                req.userId = decodedToken.sub;

                const foundUser = await User.findOne({
                    '_id': req.userId,
                    'mailBoxes.user': req.body.user
                });

                if (!foundUser) {
                    return res.json({
                        success: 0,
                        msg: 'Brak skrzynki o takim adresie'
                    });
                }

                const foundMail = await User.findOne({
                    '_id': req.userId,
                    'mailBoxes.user': req.body.user,
                    'mailBoxes.blacklist.mails': req.body.mail
                });

                if (foundMail) {
                    return res.json({
                        success: 0,
                        msg: 'Skrzynka o takim adresie jest już na blackliście'
                    });
                }


                User.updateOne({
                    '_id': req.userId,
                    'mailBoxes.user': req.body.user
                }, { $push: {
                    'mailBoxes.$.blacklist.mails': req.body.mail
                }}, (err) => {
                    if (err) {
                        return res.json({
                            success: 0,
                            msg: 'Nie udało się dodać maila do blacklisty'
                        });
                    } else {
                        return res.json({
                            success: 1,
                            msg: 'Pomyślnie dodano maila do blacklisty'
                        });
                    }
                });
            }
        });

    } catch (err) {
        console.log('ERROR: ', err);
    }
}

module.exports = addMailToBlacklist;
