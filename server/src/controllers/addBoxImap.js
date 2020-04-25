const Imap = require('imap');
const User = require('../models/users');
const jwt = require('jsonwebtoken');

function addBoxImap (req, res, next) {
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
          tls: true
        });
        imap.once('ready', async function() {
          User.update( { '_id':req.userId }, { $push: {
            protocol: imap,
            user: req.body.user,
            password: req.body.password,
            host: req.body.host
          }});
  
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