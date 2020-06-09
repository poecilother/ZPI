const User = require('../models/users');
const Mail = require('../models/mails');
const Spam = require('../models/spam');
const Ham = require('../models/ham');
const jwt = require('jsonwebtoken');
const downloadEmailsImap = require('../middlewares/downloadEmailsImap');
const downloadEmailsPop3 = require('../middlewares/downloadEmailsPop3');
const bayes = require('../middlewares/bayes');

async function downloadEmails (req, res) {
    try {
        req.setTimeout(600000);

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
    return new Promise(async (resolve) => {

        let userData = {
            user: foundUser.mailBoxes[k].user,
            password: foundUser.mailBoxes[k].password,
            userId: userId,
            protocol: foundUser.mailBoxes[k].host
        };

        const foundMails = await Mail.find({
            'owner': userId,
            'address': foundUser.mailBoxes[k].user
        });
        
        if (foundMails.length != 0) {
            let dateArray = [];
            let date = null;

            for (i = 0; i < foundMails.length; i++) {
                date = foundMails[i].date
                newDate = new Date(date)
                dateArray.push(newDate);
            }
            sortedArray = dateArray.sort((a, b) => b - a);
            newestEmailDateString = sortedArray[0].toISOString();
            newestEmailDate = newestEmailDateString.split('T', 1)[0]
        } else { newestEmailDate = 0 }

        

        if(foundUser.mailBoxes[k].protocol == 'imap'){
            downloadEmailsImap(userData, newestEmailDate).then(emails => {
                console.log('wyjscie z imap')
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
                console.log('wyjscie z pop3')
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
        mailCounter = 0;
        wordsBlacklist = 0;
        mailsBlacklist = 0;
        algorithm = 0;
        spamDays = [0, 0, 0, 0, 0, 0 ,0];
        hamDays = [0, 0, 0, 0, 0, 0, 0];

        const foundSpam = await Spam.find({});
        const foundHam = await Ham.find({});
        
        spamList = {};
        hamList = {};
        spamParam = {
            "amm": foundSpam[0].amm,
            "len": foundSpam[0].len
        };
        hamParam = {
            "amm": foundHam[0].amm,
            "len": foundHam[0].len
        };

        for (i = 0; i < foundSpam.length; i++) {
            spamList[foundSpam[i].word] = foundSpam[i].freq;
        }

        for (i = 0; i < foundHam.length; i++) {
            hamList[foundHam[i].word] = foundHam[i].freq;
        }

        for (let i = 0; i < emails.length; i++) {
            //console.log('I: ', i)

            const foundUser = await User.findOne({
                '_id': userData.userId,
                'mailBoxes.user': userData.user
            }, 'mailBoxes.$');

            const foundMessageId = await Mail.findOne({
                'owner': userData.userId,
                'address': userData.user,
                'messageId': emails[i].messageId
            });

            if (!foundMessageId) {

                date = emails[i].date;
                newDate = new Date(date);
                isoDate = newDate.toISOString();

                emailDay = newDate.getDay();

                folder = 1;

                body = emails[i].body.html

                if (!(typeof(body) == 'string')) {
                    body = body.toString();
                }


                lowercaseBody = body.toLowerCase();

                from = emails[i].from.address

                for (j = 0; j < foundUser.mailBoxes[0].blacklist.mails.length; j++) {
                    compare = from.localeCompare(foundUser.mailBoxes[0].blacklist.mails[j]);
                    if (compare == 0) {
                        folder = 2;
                        mailsBlacklist++;
                        spamDays[emailDay]++;
                        j = foundUser.mailBoxes[0].blacklist.mails.length;
                    }
                }

                if (folder != 2) {
                    for (j = 0; j < foundUser.mailBoxes[0].blacklist.words.length; j++) {
                        if (lowercaseBody.includes(foundUser.mailBoxes[0].blacklist.words[j])) {
                            folder = 2;
                            wordsBlacklist++;
                            spamDays[emailDay]++;
                            j = foundUser.mailBoxes[0].blacklist.words.length;
                        }
                    }
                }

                if (folder != 2) {
                    level = foundUser.mailBoxes[0].level;

                    const isSpam = bayes(body, level, spamParam, hamParam, spamList, hamList);
        
                    if (isSpam == 1) {
                        folder = 2;
                        algorithm++;
                        spamDays[emailDay]++;
                    }
                }

                if (folder == 1) {
                    hamDays[emailDay]++;
                }

                const newMail = new Mail({
                    messageId: emails[i].messageId,
                    from: {
                        address: emails[i].from.address,
                        name: emails[i].from.name
                    },
                    subject: emails[i].subject,
                    body: emails[i].body.html,
                    unseen: 1,
                    folder: folder,
                    owner: userData.userId,
                    address: userData.user,
                    date: isoDate
                });

                await newMail.save();

                mailCounter ++;
            }

        }

        await User.updateOne({
            '_id': userData.userId,
            'mailBoxes.user': userData.user
        }, { $inc: {
            'mailBoxes.$[sub].statistics.mailScore': mailsBlacklist,
            'mailBoxes.$[sub].statistics.wordScore': wordsBlacklist,
            'mailBoxes.$[sub].statistics.algorithmScore': algorithm,
            'mailBoxes.$[sub].statistics.mailsCounter': mailCounter,
            'mailBoxes.$[sub].statistics.spamDays.0': spamDays[0],
            'mailBoxes.$[sub].statistics.spamDays.1': spamDays[1],
            'mailBoxes.$[sub].statistics.spamDays.2': spamDays[2],
            'mailBoxes.$[sub].statistics.spamDays.3': spamDays[3],
            'mailBoxes.$[sub].statistics.spamDays.4': spamDays[4],
            'mailBoxes.$[sub].statistics.spamDays.5': spamDays[5],
            'mailBoxes.$[sub].statistics.spamDays.6': spamDays[6],
            'mailBoxes.$[sub].statistics.hamDays.0': hamDays[0],
            'mailBoxes.$[sub].statistics.hamDays.1': hamDays[1],
            'mailBoxes.$[sub].statistics.hamDays.2': hamDays[2],
            'mailBoxes.$[sub].statistics.hamDays.3': hamDays[3],
            'mailBoxes.$[sub].statistics.hamDays.4': hamDays[4],
            'mailBoxes.$[sub].statistics.hamDays.5': hamDays[5],
            'mailBoxes.$[sub].statistics.hamDays.6': hamDays[6]
        }},
        { 'arrayFilters': [
            {'sub.user': userData.user}
        ]});

        if (mailCounter == 0) {
            //console.log('returning 0');
            return resolve(0);
        }
        console.log('returning mailCounter');
        return resolve(mailCounter);
    });
}

module.exports = downloadEmails
