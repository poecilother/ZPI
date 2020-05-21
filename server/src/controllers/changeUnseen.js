const User = require('../models/users');
const jwt = require('jsonwebtoken');

async function changeUnseen (req, res, next) {

    if (!req.body.messageId) {
        return res.json({
            success: 0,
            msg: 'Brak ID maila'
        })
    }

    if (req.body.unseen < 0 || req.body.unseen > 1){
        return res.json({
            success: 0,
            msg: 'Podaj 0 albo 1'
        });
    }
    
    let x = parseFloat(req.body.unseen);

    if (isNaN(x) || !(parseInt(Number(x)) == x)){
        return res.json({
            success: 0,
            msg: 'Podaj 0 albo 1'
        });
    }

    jwt.verify(req.header('authorization'), process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
            return res.json({ success: -1 });
        } else {
            req.userId = decodedToken.sub;

            User.updateOne({
                '_id': req.userId,
                'mailBoxes': {
                    '$elemMatch': {
                        'mails.messageId': req.body.messageId
                    }
                }
            }, 
            { $set: {
                'mailBoxes.$[].mails.$[inner].unseen': parseFloat(req.body.unseen)
            }},
            { 'arrayFilters': [
                {'inner.messageId': req.body.messageId}
            ]}, (err) => {
                if (err) {
                    return res.json({
                        success: 0,
                        msg: 'Nie udało się zmienić unseen'
                    });
                } else {
                    return res.json({
                        success: 1,
                        msg: 'Pomyślnie zmienono unseen'
                    });
                }
            });
        }
    });
}



module.exports = changeUnseen;
