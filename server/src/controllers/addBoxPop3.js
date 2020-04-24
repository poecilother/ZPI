const POP3Client = require("mailpop3");

function addBoxPop3(req, res, next){
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

client.on("login", function(status, rawdata) {
  if(status) {
    res.locals.success = 1;
    res.locals.msg = 'Dodano nową skrzynkę' 
  }else{
    res.locals.success = 0;
    res.locals.msg = 'Autoryzacja nie powiodła się' 
  }
  next();
});
}

module.exports = addBoxPop3;