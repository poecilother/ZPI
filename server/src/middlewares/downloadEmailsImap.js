const Imap = require('imap')
const inspect = require('util').inspect;
const simpleParser = require('mailparser').simpleParser;

async function downloadEmailsImap(imapData) {
    return new Promise((resolve, reject) => {
        const imap = new Imap({
            user: imapData.user,
            password: imapData.password,
            host: 'imap.wp.pl',
            port: 993,
            tls: true
        });
    
        let emails = Array();
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
            imap.once('ready', function() {
                imap.openBox('INBOX', true, function(err, box) {
                    let done = 0;
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
                                let newEmail = createEmail();
                                //console.log(prefix + mail.subject);
                                //console.log(prefix + mail.text);
                                console.log(mail.subject);
                                //console.log(mail.textAsHtml);
                                //console.log(mail.html)
                                newEmail.from.address = mail.from.value[0].address;
                                newEmail.from.name = mail.from.value[0].name;
                                newEmail.date = mail.date;
                                newEmail.subject = mail.subject;
                                newEmail.body.text = mail.text;
                                newEmail.body.html = mail.html;
                                newEmail.body.textAsHtml = mail.textAsHtml;
                                newEmail.messageId = mail.messageId;
                                console.log('TEMAT: ' + email.subject);
                                emails.push(newEmail);
                                if(done){
                                    console.log('Returning emails');
                                    imap.end();
                                    return resolve(emails);
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
};

function createEmail() {
    let newEmail = { 
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
        },
        messageId: ''  };
    return newEmail;
};

module.exports = downloadEmailsImap;
