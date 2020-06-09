const User = require('../models/users');
const Mail = require('../models/mails');
const jwt = require('jsonwebtoken');

async function delBox (req, res, next) {
    try {
        if (!req.body.user) {
            return res.json({
                success: 0,
                msg: 'Podaj adres skrzynki do usunięcia'
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
    
                if (foundUser) {
                    User.updateOne({ '_id':req.userId }, { $pull: { mailBoxes: { user: req.body.user }}}, (err) => {
                        if (err) {
                            return res.send(err);
                        }  
                    });
    
                    const foundMails = await Mail.find({
                        'owner': req.userId,
                        'address': req.body.user
                    });

                    console.log(foundMails.length)

                    promises = [];
    
                    for (i = 0; i < foundMails.length; i++) {
                        promises.push(delMail(req.userId, req.body.user, foundMails[i].messageId));
                    }
                    
                    Promise.all(promises).then((resolve) => {
                        return res.json({
                            success: 1,
                            msg: 'Skrzynka została usunięta'
                        });
                    });
                } else {
                    res.json({
                        success: 0,
                        msg: 'Nie ma skrzynki o takim adresie'
                    });
                }
            }
        });
    } catch (err) {
        console.log(err)
    }
    
}

async function delMail(owner, address, messageId) {
    return new Promise(async (resolve, reject) => {
        await Mail.findOneAndDelete({
            'owner': owner,
            'address': address,
            'messageId': messageId
        }, (err) => {
            if (err) {
                return reject(1)
            } else {
                return resolve(1)
            }
        })
    });
}

module.exports = delBox;
