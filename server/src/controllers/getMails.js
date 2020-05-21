const User = require('../models/users');
const jwt = require('jsonwebtoken');

async function getMails (req, res, next) {

    try {
        if (!req.query.folder) {
            return res.json({
                success: 0,
                msg: 'Brak numeru folderu'
            }); 
        }
    
        if (!req.query.user) {
            jwt.verify(req.header('authorization'), process.env.JWT_SECRET, async (err, decodedToken) => {
                if (err) {
                    return res.json({ success: -1 });
                } else {
                    req.userId = decodedToken.sub;
    
                    const foundUser = await User.findOne({
                        '_id':req.userId
                    }, 'mailBoxes');
    
                    if (foundUser) {
                        let promises = [];
                        
                        mails = [];

                        console.log('MAILBOXES: ', foundUser.mailBoxes.length)
                        for (let i = 0; i < foundUser.mailBoxes.length; i++) {
                            if (!foundUser.mailBoxes[i].mails) {
                                i++;
                            } else {
                                let k = 0;
                                for (let j = 0; j < foundUser.mailBoxes[i].mails.length; j++) {
                                    if (foundUser.mailBoxes[i].mails[j].folder == req.query.folder) {
                                        promises.push(pushMails(foundUser, i, j, mails, k));
                                        k++;
                                    }
                                }
                            }
                        }
                        
                        Promise.all(promises).then((mails) => {

                            if (!mails[0]) {
                                return res.json({
                                    success: 1,
                                    mails: mails
                                });
                            }

                            console.log('Długość mails: ', mails[0].length)

                            sendMails = [];

                            for (let i = 0; i < mails[0].length; i++) {
                                sendMails.push(mails[0][i]);
                            }

                            const sortedSendMails = sendMails.sort((a, b) => b.date - a.date);

                            return res.json({
                                success: 1,
                                mails: sortedSendMails
                            });
                        }).catch(function (err) {
                            console.log('PROMISE: ', err);
                       });
                    }
                }
            });
        } else {
            jwt.verify(req.header('authorization'), process.env.JWT_SECRET, async (err, decodedToken) => {
                if (err) {
                    return res.json({ success: -1 });
                } else {
                    req.userId = decodedToken.sub;
        
                    mails = new Array();
        
        
                    const foundUser = await User.findOne({
                        '_id':req.userId,
                        'mailBoxes.user': req.query.user
                    }, 'mailBoxes.$');

                    if (foundUser) {
                        let k = 0;
                        for (j = 0; j < foundUser.mailBoxes[0].mails.length; j++) {
                            if (foundUser.mailBoxes[0].mails[j].folder == req.query.folder) {
                                mails.push(foundUser.mailBoxes[0].mails[j]);
                                delete mails[k].body;
                                k++;
                            }
                        }
                    }
                }

                if (mails.length == 0) {
                    return res.json({
                        success: 0,
                        msg: 'Nie masz żadnych wiadomości'
                    });  
                }

                const sortedMails = mails.sort((a, b) => b.date - a.date);

                return res.json({
                    success: 1,
                    mails: sortedMails
                });
            });
        }
    } catch (err) {
        console.log("ERROR: ", err)
    }
}

async function pushMails(foundUser, i, j, mails, k) {
    try{
        return new Promise((resolve) => {
            mails.push(foundUser.mailBoxes[i].mails[j]);
            delete mails[k].body;
            return resolve(mails);
        });
    } catch (err) {
        console.log('ERROR: ', err);
    }
}

module.exports = getMails;
