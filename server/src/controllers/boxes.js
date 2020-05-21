const Imap = require('imap');
const User = require('../models/users');
const jwt = require('jsonwebtoken');

function getBoxData (req, res, next) {
    jwt.verify(req.header('authorization'), process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
            res.json({ success: -1 });
        } else {
            req.userId = decodedToken.sub;

            const foundUser = await User.findOne({ 
                '_id':req.userId,
            }, ['mailBoxes.protocol', 'mailBoxes.user', 'mailBoxes.host', 'mailBoxes.level']);

            let boxes = [];

            for (i = 0; i < foundUser.mailBoxes.length; i++) {
                var boxesToPush = foundUser.mailBoxes[i]

                let unseenSumForFolder1 = 0;
                let unseenSumForFolder2 = 0;
                let unseenSumForFolder3 = 0;
                console.log('USER: ', foundUser.mailBoxes[i].user)

                const foundMail = await User.findOne({
                    '_id':req.userId,
                    'mailBoxes.user': foundUser.mailBoxes[i].user
                }, 'mailBoxes.$');
                
                console.log(foundMail.mailBoxes[0].mails.length);

                for (j = 0; j < foundMail.mailBoxes[0].mails.length; j++) {
                    if (foundMail.mailBoxes[0].mails[j].folder == 1) {
                        unseenSumForFolder1 += foundMail.mailBoxes[0].mails[j].unseen;
                    } else if (foundMail.mailBoxes[0].mails[j].folder == 2) {
                        unseenSumForFolder2 += foundMail.mailBoxes[0].mails[j].unseen;
                    } else {
                        unseenSumForFolder3 += foundMail.mailBoxes[0].mails[j].unseen;
                    }
                }

                boxesToPush['Folder 1'] = unseenSumForFolder1;
                boxesToPush['Folder 2'] = unseenSumForFolder2;
                boxesToPush['Folder 3'] = unseenSumForFolder3;

                boxes.push(boxesToPush);
            }

            
            if (foundUser) {
                return res.json({
                    success: 1,
                    boxes: boxes
                });
            } else {
                res.json({
                    success: 0,
                    msg: 'Brak skrzynek'
                });
            }
        }
    });
}

module.exports = getBoxData;
