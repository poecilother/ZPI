const User = require('../models/users');
const Mail = require('../models/mails');
const jwt = require('jsonwebtoken');

async function delMail (req, res, next) {
    if (!req.body.user) {
        return res.json({
            success: 0,
            msg: 'Brak adresu skrzynki'
        });
    }

    if (!req.body.id) {
        return res.json({
            success: 0,
            msg: 'Zaznacz mail do usunięcia'
        });
    }

    jwt.verify(req.header('authorization'), process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
            res.json({ success: -1 });
        } else {
            req.userId = decodedToken.sub;

            
            const foundUser = await User.findOne({ 
                '_id':req.userId,
                'mailBoxes.user': req.body.user
            });

            if (!foundUser) {
                return res.json({
                    success: 0,
                    msg: 'Nie ma skrzynki o takim adresie'
                });
            }

            /*
            for (i = 0; i < req.body.id.length; i++) {
                await User.updateOne({
                    '_id': req.userId,
                    'mailBoxes.user': req.body.user
                }, { $pull: { 'mailBoxes.$.mails': {
                    messageId: req.body.id[i]
                }}});
                console.log(req.body.id[i])
            }
            return res.json({
                success: 1,
                msg: 'Pomyślnie usunięto maile'
            });
            */

            const foundMails = await Mail.find({
                'owner': req.userId,
                'address': req.body.user
            });

            if (!foundMails) {
                return res.json({
                    success: 0,
                    msg: 'W skrzynce nie ma mail o podanych id'
                });
            }

            for (i = 0; i < req.body.id.length; i++) {
                await Mail.findOneAndDelete({
                    'owner': req.userId,
                    'address': req.body.user,
                    'messageId': req.body.id[i]
                })
            }
            return res.json({
                success: 1,
                msg: 'Pomyślnie usunięto maile'
            });

        }
    });
} 

module.exports = delMail;
