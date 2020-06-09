const User = require('../models/users');
const Mail = require('../models/mails');
const jwt = require('jsonwebtoken');

async function stats (req, res, next) {
    jwt.verify(req.header('authorization'), process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
            return res.json({ success: -1 });
        } else {
            req.userId = decodedToken.sub;

            const foundUser = await User.findOne({ 
                '_id':req.userId,
            }, ['mailBoxes.statistics', 'mailBoxes.user']);

            mailScore = 0;
            wordScore = 0;
            algorithmScore = 0;
            mailsCounter = 0;
            spamDays = [0, 0, 0, 0, 0, 0, 0];
            hamDays = [0, 0, 0, 0, 0, 0, 0];
            folder_1 = 0;
            folder_2 = 0;
            folder_3 = 0;

            if (foundUser) {
                for (i = 0; i < foundUser.mailBoxes.length; i++) {

                    const foundMail = await Mail.find({
                        'owner': req.userId,
                        'address': foundUser.mailBoxes[i].user
                    }, {
                        'folder': 1
                    });

                    if (foundMail) {
                        for (j = 0; j < foundMail.length; j++) {
                            if (foundMail[j].folder == 1) {
                                folder_1 += 1;
                            } else if (foundMail[j].folder == 2) {
                                folder_2 += 1;
                            } else {
                                folder_3 += 1;
                            }
                        }
                    }
    
                    mailScore += foundUser.mailBoxes[i].statistics.mailScore;
                    wordScore += foundUser.mailBoxes[i].statistics.wordScore;
                    algorithmScore += foundUser.mailBoxes[i].statistics.algorithmScore;
                    mailsCounter += foundUser.mailBoxes[i].statistics.mailsCounter;
                    
                    for (j = 0; j < foundUser.mailBoxes[i].statistics.spamDays.length; j++) {
                        spamDays[j] += foundUser.mailBoxes[i].statistics.spamDays[j];
                        hamDays[j] += foundUser.mailBoxes[i].statistics.hamDays[j];
                    }
                }
            }

            return res.json({
                success: 1,
                mailScore: mailScore,
                wordScore: wordScore,
                algorithmScore: algorithmScore,
                mailsCounter: mailsCounter,
                spamDays: spamDays,
                hamDays: hamDays,
                folder_1: folder_1,
                folder_2: folder_2,
                folder_3: folder_3
            });
        }
    });
}

module.exports = stats;
