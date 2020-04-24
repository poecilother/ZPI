const Imap = require('imap')

function addBoxImap(req, res, next){
  let imap = new Imap({
    user: req.body.user,
    password: req.body.password,
    host: req.body.host,
    port: 993,
    tls: true
  });
  imap.once('ready', async function() {
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

module.exports = addBoxImap;