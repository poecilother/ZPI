const User = require('../models/users');
const jwt = require('jsonwebtoken');

async function delWordFromBlacklist (req, res, next) {
    try {
        if(!req.body.user) {
            return res.json({
                success: 0,
                msg: 'Podaj adres skrzynki'
            });
        }

        if(!req.body.word) {
            return res.json({
                success: 0,
                msg: 'Podaj słowo'
            });
        }
        
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

                const word = req.body.word.toLowerCase();

                const foundMail = await User.findOne({
                    '_id': req.userId,
                    'mailBoxes.user': req.body.user,
                    'mailBoxes.blacklist.words': word
                });

                if (!foundMail) {
                    return res.json({
                        success: 0,
                        msg: 'Na blackliście nie ma takiego słowa'
                    });
                }

                await User.updateOne({
                    '_id': req.userId,
                    'mailBoxes.user': req.body.user
                }, { $pull: {
                    'mailBoxes.$.blacklist.words': word
                }}, (err) => {
                    if (err) {
                        return res.json({
                            success: 0,
                            msg: 'Nie udało się usunąć słowa z blacklisty'
                        });
                    } else {
                        return res.json({
                            success: 1,
                            msg: 'Pomyślnie usunięto'
                        });
                    }
                });

            }
        });
    } catch (err) {
        console.log('ERROR: ', err);
    }
}

module.exports = delWordFromBlacklist;
