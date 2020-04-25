const Imap = require('imap');
const User = require('../models/users');
const jwt = require('jsonwebtoken');

function delBoxImap (req, res, next) {
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
                User.updateOne({ '_id':req.userId }, { $pull: { mailBoxes: { user: req.body.user }}}, (err, model) => {
                    if (err) {
                        return res.send(err);
                    }
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
}

module.exports = delBoxImap;
