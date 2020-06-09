const Imap = require('imap');
const User = require('../models/users');
const jwt = require('jsonwebtoken');

function addBoxImap (req, res, next) {
  if (!req.body.user || !req.body.password || !req.body.host) {
    return res.json({
      success: 0,
      msg: 'Nie wszystkie pola są wypełnione'
    });
  }

  jwt.verify(req.header('authorization'), process.env.JWT_SECRET, async (err, decodedToken) => {
    if (err) {
        res.json({ success: -1 });
    } else {
        req.userId = decodedToken.sub;

        let imap = new Imap({
          user: req.body.user,
          password: req.body.password,
          host: req.body.host,
          port: 993,
          tls: true,
          tlsOptions: {
            rejectUnauthorized: false
          }
        });
        imap.once('ready', async function() {
          const foundUser = await User.findOne({ 
            '_id':req.userId,
            'mailBoxes.user': req.body.user
          });

          if (foundUser) {
            return res.json({
              success: 0,
              msg: 'Skrzynka o takim adresie jest już zapisana'
            });
          }

          await User.updateOne( { '_id':req.userId }, { $push: { mailBoxes: {
            protocol: 'imap',
            user: req.body.user,
            password: req.body.password,
            host: req.body.host,
            level: 2,
            blacklist: {
              mails: [],
              words: []
            },
            statistics: {
              mailScore: 0,
              wordScore: 0,
              algorithmScore: 0,
              mailsCounter: 0,
              spamDays: [0,0,0,0,0,0,0],
              hamDays: [0,0,0,0,0,0,0]
            }
          }}});

          res.locals.success = 1;
          res.locals.msg = 'Dodano nową skrzynkę' 
          next();
        });
        imap.once('error', async function(err) {
          if(err.source == "authentication"){
            res.locals.success = 0;
            res.locals.msg = 'Autoryzacja nie powiodła się' 
          }else{
            res.locals.success = 0;
            res.locals.msg = 'Adres hosta jest nie poprawny' 
          }
          next();
        });
        imap.connect();
    }
  });
}

module.exports = addBoxImap;