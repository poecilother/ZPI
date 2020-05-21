const User = require('../models/users');
const jwt = require('jsonwebtoken');

async function getWordsFromBlacklist (req, res, next) {
    try {

        if (!req.query.user) {
            return res.json({
                success: 0,
                msg: 'Podaj adres skrzynki'
            });
        }

        jwt.verify(req.header('authorization'), process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                return res.json({ success: -1 });
            } else {
                req.userId = decodedToken.sub;

                const foundUser = await User.findOne({
                    '_id': req.userId,
                    'mailBoxes.user': req.query.user
                });

                if (foundUser) {
                    
                    return res.json({
                        success: 1,
                        words: foundUser.mailBoxes[0].blacklist.words
                    });

                } else {
                    return res.json({
                        success: 0,
                        msg: 'Brak skrzynki o takim adresie'
                    });
                }



            }
        });
    } catch (err) {
        console.log('ERROR: ', err);
    }
}

module.exports = getWordsFromBlacklist
