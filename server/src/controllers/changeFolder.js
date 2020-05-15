const User = require('../models/users');
const jwt = require('jsonwebtoken');

function changeFolder (req, res, next) {
    if (!req.body.messageId) {
        return res.json({
            success: 0,
            msg: 'Brak ID maila'
        })
    }

    jwt.verify(req.header('authorization'), process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
            return res.json({ success: -1 });
        } else {
            req.userId = decodedToken.sub;

            const user = req.body.user;
            const foundUser = await User.findOne({
                '_id': req.userId,
                'mailBoxes': {
                    '$elemMatch': {
                        user, 'mails.messageId': req.body.messageId
                    }
                }
            }, 'mailBoxes');

            if (foundUser) {
                await User.updateOne({
                    '_id': req.userId,
                    'mailBoxes': {
                        '$elemMatch': {
                            'mails.messageId': req.body.messageId
                        }
                    }
                }, 
                { $set: {
                    'mailBoxes.$[outer].mails.$[inner].folder': req.body.folder
                }},
                { 'arrayFilters': [
                    {'outer.user': req.body.user},
                    {'inner.messageId': req.body.messageId}
                ]}, (err, result) => {
                    if (err) {
                        return res.json({
                            success: 0,
                            msg: err
                        });
                    } else {
                        console.log(result)
                        return res.json({
                            success: 1,
                            msg: 'Pomyślnie zmieniono folder'
                        });
                    }
                });
            } else {
                return res.json({
                    success: 0,
                    msg: 'Nie ma maila o tym id w podanej skrzynce'
                });
            }
        }
    });
}

module.exports = changeFolder;
