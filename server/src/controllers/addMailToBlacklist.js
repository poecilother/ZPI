const User = require('../models/users');
const jwt = require('jsonwebtoken');

async function addMailToBlacklist (req, res, next) {
    try {

        jwt.verify(req.header('authorization'), process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                return res.json({ success: -1 });
            } else {
                req.userId = decodedToken.sub;

                await User.updateOne({
                    '_id': req.userId,
                    'mailBoxes.user': req.body.user
                }, { $push: {
                    'mailBoxes.blacklist.$.mails': req.body.mail
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
