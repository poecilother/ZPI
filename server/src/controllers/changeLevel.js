const User = require('../models/users');
const jwt = require('jsonwebtoken');

function changeLevel (req, res, next) {
    if (!req.body.user || !req.body.level) {
        return res.json({
            success: 0,
            msg: 'Nie wszystkie pola są wypełnione'
        });
    }

    if (req.body.level < 1 || req.body.level > 3){
        return res.json({
            success: 0,
            msg: 'Niepoprawny poziom'
        });
    }
    
    let x = parseFloat(req.body.level);

    if (isNaN(x) || !(parseInt(Number(x)) == x)){
        return res.json({
            success: 0,
            msg: 'Niepoprawny poziom'
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
                User.updateOne({ 
                    '_id':req.userId,
                    'mailBoxes.user': req.body.user
                }, { $set: { 'mailBoxes.$.level': parseFloat(req.body.level) }}, (err, model) => {
                    if (err) {
                        return res.send(err);
                    }
                    return res.json({
                        success: 1,
                        msg: 'Zaktualizowano poziom filtra spamu'
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

module.exports = changeLevel;
