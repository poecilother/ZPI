const User = require('../models/users');
const jwt = require('jsonwebtoken');
const downloadEmailsImap = require('../middlewares/downloadEmailsImap');
const downloadEmailsPop3 = require('../middlewares/downloadEmailsPop3');

async function downloadEmails (req, res) {
    try {
        jwt.verify(req.header('authorization'), process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                return res.json({ success: -1 });
            } else {
                req.userId = decodedToken.sub;
            }
        });
    
        const foundUser = await User.findOne({ 
            '_id':req.userId,
            'mailBoxes.user': req.body.user
        }, 'mailBoxes.$');
    
        if (foundUser) {
            let userData = {
                user: foundUser.mailBoxes[0].user,
                password: foundUser.mailBoxes[0].password,
                userId: req.userId
            };
    
            if(foundUser.mailBoxes[0].protocol == 'imap'){
                downloadEmailsImap(userData).then(emails => {
                    console.log('wyjscie z imap')
                    addToDatabase(emails, userData).then(success => {
                        if (success == 0) {
                            return res.json({
                                success: 0,
                                msg: 'Brak nowych wiadomości'
                            });
                        } else {
                            let msg = 'Pomyślnie dodano ' + success + ' maili'
                            return res.json({
                                success: 1,
                                msg: msg
                            });
                        }
                    });
                });
            } else {
                console.log('Pop3');
                downloadEmailsPop3(userData).then(emails => {
                    addToDatabase(emails, userData).then(success => {
                        if (success == 0) {
                            return res.json({
                                success: 0,
                                msg: 'Brak nowych wiadomości'
                            });
                        } else {
                            let msg = 'Pomyślnie dodano ' + success + ' maili'
                            return res.json({
                                success: 1,
                                msg: msg
                            });
                        }
                    });
                });
            }
        } else {
            return res.json({
                success: 0,
                msg: 'Brak skrzynek'
            });
        }
    } catch (err) {
        console.log(err)
    }
    
};

async function addToDatabase(emails, userData) {
    return new Promise(async (resolve, reject) => {
        let mailCounter = 0;
        for (let i = 0; i < emails.length; i++) {
            const foundMessageId = await User.findOne({
                '_id': userData.userId,
                'mailBoxes.user': userData.user,
                'mailBoxes.mails.messageId': emails[i].messageId
            });
    
            if (!foundMessageId) {
                await User.updateOne({
                    '_id': userData.userId,
                    'mailBoxes.user': userData.user
                }, { $push: { 'mailBoxes.$.mails': {
                    messageId: emails[i].messageId,
                    from: {
                        address: emails[i].from.address,
                        name: emails[i].from.name
                    },
                    subject: emails[i].subject,
                    body: emails[i].body.html,
                    unseen: 0,
                    folder: 1,
                    owner: userData.userId,
                    address: userData.user
                }}});
                mailCounter ++;
            } 
        }
        if (mailCounter == 0) {
            return resolve(0);
        }
        return resolve(mailCounter);
    });
}

module.exports = downloadEmails
