const User = require('../models/users');
const Mail = require('../models/mails');
const jwt = require('jsonwebtoken');

function changeFolder (req, res, next) {
    console.log(req.body.messageId[0])

    if (!req.body.messageId) {
        return res.json({
            success: 0,
            msg: 'Brak ID maila'
        })
    }

    if (req.body.folder < 1 || req.body.folder > 3){
        return res.json({
            success: 0,
            msg: 'Niepoprawny folder'
        });
    }
    
    let x = parseFloat(req.body.folder);

    if (isNaN(x) || !(parseInt(Number(x)) == x)){
        return res.json({
            success: 0,
            msg: 'Niepoprawny folder'
        });
    }

    jwt.verify(req.header('authorization'), process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
            return res.json({ success: -1 });
        } else {
            req.userId = decodedToken.sub;

            let promises = [];
        
            for (let i = 0; i < req.body.messageId.length; i++) {
                promises.push(updateFolder(req.userId, req.body.messageId[i], parseFloat(req.body.folder), i));
            }

            Promise.all(promises).then((success) => {
                successSum = success.reduce((a, b) => a + b, 0);
                if (successSum > 0) {
                    return res.json({
                        success: 1,
                        msg: 'Pomyślnie zmienono folder'
                    });
                } else {
                    return res.json({
                        success: 0,
                        msg: 'Nie udało się zmienić folderu'
                    });
                }
            });
        }
    });
}

async function updateFolder (userId, messageId, folder) {
    try {  
        return new Promise(async (resolve) => {
           await Mail.updateOne({
                'owner': userId,
                'messageId': messageId
            }, 
            { $set: {
                'folder': folder
            }}, (err) => {
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

module.exports = changeFolder;
