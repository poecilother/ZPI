const User = require('../models/users');
const jwt = require('jsonwebtoken');

function changeUnseen (req, res, next) {
    console.log(req.body.messageId[0])

    if (!req.body.messageId) {
        return res.json({
            success: 0,
            msg: 'Brak ID maila'
        })
    }

    if (req.body.unseen < 0 || req.body.unseen > 1){
        return res.json({
            success: 0,
            msg: 'Niepoprawna wartość unseen'
        });
    }
    
    let x = parseFloat(req.body.unseen);

    if (isNaN(x) || !(parseInt(Number(x)) == x)){
        return res.json({
            success: 0,
            msg: 'Niepoprawna wartość unseen'
        });
    }

    jwt.verify(req.header('authorization'), process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
            return res.json({ success: -1 });
        } else {
            req.userId = decodedToken.sub;

            let promises = [];
        
            for (let i = 0; i < req.body.messageId.length; i++) {
                promises.push(updateFolder(req.userId, req.body.messageId[i], parseFloat(req.body.unseen), i));
            }

            Promise.all(promises).then((success) => {
                successSum = success.reduce((a, b) => a + b, 0);
                if (successSum > 0) {
                    return res.json({
                        success: 1,
                        msg: 'Pomyślnie zmienono wartość unseen'
                    });
                } else {
                    return res.json({
                        success: 0,
                        msg: 'Nie udało się zmienić wartości unseen'
                    });
                }
            });
        }
    });
}

async function updateFolder (userId, messageId, unseen) {
    try {  
        return new Promise(async (resolve) => {
            await User.updateOne({
                '_id': userId,
                'mailBoxes': {
                    '$elemMatch': {
                        'mails.messageId': messageId
                    }
                }
            }, 
            { $set: {
                'mailBoxes.$[].mails.$[inner].unseen': unseen
            }},
            { 'arrayFilters': [
                {'inner.messageId': messageId}
            ]}, (err) => {
                if (err) {
                    return resolve(0);
                } else {
                    return resolve(1);
                }
            });
        });
    } catch (err) {
        console.log('ERROR: ', err);
    }
}

module.exports = changeUnseen;
