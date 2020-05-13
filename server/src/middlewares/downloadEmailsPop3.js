const simpleParser = require('mailparser').simpleParser;


async function downloadEmailsPop3 (pop3Data) {
    return new Promise((resolve, reject) => {

        let number = 0;
        let counter = 1;

        let emails = Array();

        var POP3Client = require("mailpop3");
        var client = new POP3Client(995, 'pop3.wp.pl', {
        
                tlserrs: false,
                enabletls: true,
                debug: false
        
            });
            client.on("error", function(err) {
    
                if (err.errno === 111) console.log("Unable to connect to server");
                else console.log("Server error occurred");
        
                console.log(err);
        
        });
        
        client.on("connect", function() {
        
                console.log("CONNECT success");
                client.login(pop3Data.user, pop3Data.password);
        
        });
        
        client.on("invalid-state", function(cmd) {
                console.log("Invalid state. You tried calling " + cmd);
        });
        
        client.on("locked", function(cmd) {
                console.log("Current command has not finished yet. You tried calling " + cmd);
        });

        client.on("login", function(status, rawdata) {
    
            if (status) {
        
                console.log("LOGIN/PASS success");
                client.list();
        
            } else {
        
                console.log("LOGIN/PASS failed");
                client.quit();
        
            }
        });
        
        // Data is a 1-based index of messages, if there are any messages
        client.on("list", function(status, msgcount, msgnumber, data, rawdata) {
        
            if (status === false) {
        
                console.log("LIST failed");
                client.quit();
        
            } else {
        
                console.log("LIST success with " + msgcount + " element(s)");
                number = msgcount;

                if (msgcount > 0) {
                    client.retr(counter);
                }
            }
        });
        
        client.on("retr", function(status, msgnumber, data, rawdata) {
        
            if (status === true) {
        
                console.log("RETR success for msgnumber " + msgnumber);
                //console.log(rawdata)
                simpleParser(rawdata, (err, mail) => {
                    let newEmail = createEmail();
                    console.log(mail.subject);
                    //console.log(mail.from);
                    //console.log(mail.date);

                    newEmail.from.address = mail.from.value[0].address;
                    newEmail.from.name = mail.from.value[0].name;
                    newEmail.date = mail.date;
                    newEmail.subject = mail.subject;
                    newEmail.body.text = mail.text;
                    newEmail.body.html = mail.html;
                    newEmail.body.textAsHtml = mail.textAsHtml;
                    newEmail.messageId = mail.messageId;
                    emails.push(newEmail);
                    console.log('TEMAT: ' + newEmail.subject);
                    
                    counter++;

                    if (counter == number + 1) {
                        client.quit();
                    } else {
                        client.retr(counter);
                    }
                });
                //client.dele(msgnumber);
                
        
            } else {
        
                console.log("RETR failed for msgnumber " + msgnumber);
                client.quit();
        
            }
        });

        client.on("quit", function(status, rawdata) {
    
            if (status === true) {
                console.log("QUIT success");
                console.log('Lenght: ' + emails.length);
                return resolve(emails);
            } else console.log("QUIT failed");

        });
    }) 
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
        messageId: '' };
    return newEmail;
};

module.exports = downloadEmailsPop3
