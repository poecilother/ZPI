const express = require('express');
const router = express.Router();
const Imap = require('imap')
const inspect = require('util').inspect;
const simpleParser = require('mailparser').simpleParser;

const addBoxImap = require('../controllers/addBoxImap.js');
 
var imap = new Imap({
    user: 'dfecica@wp.pl',
    password: '2j0!M2dGa&v%',
    host: 'imap.wp.pl',
    port: 993,
    tls: true
});

router.get('/', function (req, res) {

let emails = { count: 0, content: Array() };
let email = { 
    from: {
        address: '',
        name: ''
    }, 
    date: '', 
    flags: '', 
    subject: '', 
    body: {
        text: '',
        html: '',
        textAsHtml: '',
    } };
    let done = 0;
    imap.once('ready', function() {
      imap.openBox('INBOX', true, function(err, box) {
          if (err) throw err;
          console.log(box.messages.total + ' message(s) found!');
          // 1:* - Retrieve all messages
          // 3:5 - Retrieve messages #3,4,5
         // var f = imap.seq.fetch('1:1', {
           // bodies: ''
          //});
          imap.search([ 'UNSEEN', ['SINCE', 'April 16, 2020'] ], function(err, results) {
            if (err) throw err;
            var f = imap.fetch(results, { bodies: '' });
          f.on('message', function(msg, seqno) {
            console.log('Message #%d', seqno);
            var prefix = '(#' + seqno + ') ';
      
            msg.on('body', function(stream, info) {
              simpleParser(stream, (err, mail) => {
                console.log(prefix + mail.subject);
                //console.log(prefix + mail.text);
                console.log(mail.from);
                console.log(mail.textAsHtml);
                //console.log(mail.html)
                email.from.address = mail.from.value[0].address;
                email.from.name = mail.from.value[0].name;
                email.date = mail.date;
                email.subject = mail.subject;
                email.body.text = mail.text;
                email.body.html = mail.html;
                email.body.textAsHtml = mail.textAsHtml;
                emails.content.push(email);
                if(done){
                    res.send(emails);
                }
              });
            });

            msg.once('attributes', function(attrs) {
              console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
            });

            msg.once('end', function() {
              console.log(prefix + 'Finished');
            });

          });
          f.once('error', function(err) {
            console.log('Fetch error: ' + err);
          });
          f.once('end', function() {
            console.log('Done fetching all messages!');
            done = 1;
            imap.end();
          });
        });
        });
      });
      
      imap.once('error', function(err) {
        console.log(err);
      });
      
      imap.once('end', function() {

        console.log('Connection ended');
      });
      
      imap.connect();

    
});

router.post('/add', addBoxImap, function (req, res) {
  res.json({ success: res.locals.success, msg: res.locals.msg })
});

module.exports = router;
