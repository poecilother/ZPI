const User = require('../models/users');
const jwt = require('jsonwebtoken');

async function getMail (req, res, next) {
    if (!req.query.messageId) {
        return res.json({
            success: 0,
            msg: 'Brak ID maila'
        });
    }

    jwt.verify(req.header('authorization'), process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
            return res.json({ success: -1 });
        } else {
            req.userId = decodedToken.sub;

            const foundUser = await User.findOne({
                '_id': req.userId,
                'mailBoxes.mails.messageId': req.query.messageId 
            }, 'mailBoxes.mails.$');

            if (foundUser) {

                for (let i = 0; i < foundUser.mailBoxes[0].mails.length; i++){
                    if (foundUser.mailBoxes[0].mails[i].messageId == req.query.messageId) {
                        return res.json({
                            success: 1,
                            mail: foundUser.mailBoxes[0].mails[i]
                        });
                    }
                }   

                return res.json({
                    success: 0,
                    msg: 'Nie znaleziono wiadomości'
                });
            } else {
                return res.json({
                    success: 0,
                    msg: 'Nie znaleziono wiadomości'
                });
            }
        }
    });
}

module.exports = getMail;
