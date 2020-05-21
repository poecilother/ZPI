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
            '_id':req.userId
        }, 'mailBoxes');
    
        if (foundUser) {

            let promises = [];
            let counter = 0;

            for (k = 0; k < foundUser.mailBoxes.length; k++) {
                promises.push(download(foundUser, req.userId, k, counter));
            }

            Promise.all(promises).then((counter) => {
                counter = counter.reduce((a, b) => a + b, 0);
                if (counter > 0) {
                    console.log(counter);
                    let msg = 'Pomyślnie dodano ' + counter + ' maili'
                    return res.json({
                        success: 1,
                        msg: msg
                    });
                } else {
                    console.log(counter);
                    return res.json({
                        success: 0,
                        msg: 'Brak nowych maili'
                    });
                }
            });
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

async function download(foundUser, userId, k, counter){
    return new Promise((resolve) => {

        let userData = {
            user: foundUser.mailBoxes[k].user,
            password: foundUser.mailBoxes[k].password,
            userId: userId
        };

        if (foundUser.mailBoxes[k].mails.length != 0) {
            let dateArray = [];
            let date = null;

            for (i = 0; i < foundUser.mailBoxes[k].mails.length; i++) {
                date = foundUser.mailBoxes[k].mails[i].date
                dateArray.push(date);
            }
            sortedArray = dateArray.sort((a, b) => b - a);
            newestEmailDateString = sortedArray[0].toISOString();
            newestEmailDate = newestEmailDateString.split('T', 1)[0]
        } else { newestEmailDate = '1970-01-01' }

        

        if(foundUser.mailBoxes[k].protocol == 'imap'){
            downloadEmailsImap(userData, newestEmailDate).then(emails => {
                //console.log('wyjscie z imap')
                addToDatabase(emails, userData).then(success => {
                    if (success > 0) {
                        return resolve(counter += success);
                    } else {
                        return resolve(counter);
                    }
                });
            });
        } else {
            //console.log('Pop3');
            downloadEmailsPop3(userData).then(emails => {
                //console.log('wyjscie z pop3')
                addToDatabase(emails, userData).then(success => {
                    if (success > 0) {
                        return resolve(counter += success);
                    } else {
                        return resolve(counter);
                    }
                });
            });
        }
    });
}

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
                    unseen: 1,
                    folder: 1,
                    owner: userData.userId,
                    address: userData.user,
                    date: emails[i].date
                }}});
                mailCounter ++;
            } 
            //console.log('mailCounter:', mailCounter);
        }
        if (mailCounter == 0) {
            //console.log('returning 0');
            return resolve(0);
        }
        //console.log('returning mailCounter');
        return resolve(mailCounter);
    });
}

module.exports = downloadEmails
