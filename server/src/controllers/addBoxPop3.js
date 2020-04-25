const POP3Client = require("mailpop3");
const User = require('../models/users');
const jwt = require('jsonwebtoken');

function addBoxPop3(req, res, next){
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

        let client = new POP3Client(995, req.body.host, {
          tlserrs: false,
          enabletls: true,
          debug: false
        });
        client.on("error", function(err) {
          if(err.errno === 111){
            res.locals.success = 1;
            res.locals.msg = 'Nie można połączyć się z serwerem' 
          }else{
            res.locals.success = 0;
            res.locals.msg = 'Adres hosta jest nie poprawny' 
          }
          next();
        });
      
        client.on("connect", function() {
          client.login(req.body.user, req.body.password);
        });
      
        client.on("login", async function(status, rawdata) {
          if(status) {
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
              protocol: 'pop3',
              user: req.body.user,
              password: req.body.password,
              host: req.body.host,
              level: 2
            }}});
    
            res.locals.success = 1;
            res.locals.msg = 'Dodano nową skrzynkę' 
          }else{
            res.locals.success = 0;
            res.locals.msg = 'Autoryzacja nie powiodła się' 
          }
          next();
      });  
    }
  });

}

module.exports = addBoxPop3;