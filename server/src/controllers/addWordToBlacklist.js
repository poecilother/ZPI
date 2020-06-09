const User = require('../models/users');
const jwt = require('jsonwebtoken');

async function addWordToBlacklist (req, res, next) {
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
                
                const foundWord = await User.findOne({
                    '_id': req.userId,
                    'mailBoxes.user': req.body.user,
                    'mailBoxes.blacklist.words': word
                });

                if (foundWord) {
                    return res.json({
                        success: 0,
                        msg: 'Słowo jest już na blackliście'
                    });
                }


                User.updateOne({
                    '_id': req.userId,
                    'mailBoxes.user': req.body.user
                }, { $push: {
                    'mailBoxes.$.blacklist.words': word
                }}, (err) => {
                    if (err) {
                        return res.json({
                            success: 0,
                            msg: 'Nie udało się dodać słowa do blacklisty'
                        });
                    } else {
                        return res.json({
                            success: 1,
                            msg: 'Pomyślnie dodano słowa do blacklisty'
                        });
                    }
                });
            }
        });

    } catch (err) {
        console.log('ERROR: ', err);
    }
}

module.exports = addWordToBlacklist;