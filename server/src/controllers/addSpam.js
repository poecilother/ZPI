const Spam = require('../models/spam');
const fs = require('fs');

async function addToSpam(req, res) {
    try {
        req.setTimeout(60000000);
        console.log('Starting')

        amm = 1280;
        len = 157.56484375;
        
        content = fs.readFileSync('spam.json', 'utf8');

        content2 = content.substr(1);

        spam = JSON.parse(content2)

        addToDatabase(spam).then(success => {
            return res.json({
                success: success
            });
        });
    } catch (err) {
        console.log(err);
    }
}


async function addToDatabase(spam) {
    return new Promise(async (resolve, reject) => {
        for (key in spam) {
            console.log(key)
            const foundWord = await Spam.findOne({
                'word': key
            });
        
            if (!foundWord) {
                const newSpam = new Spam({
                    word: key,
                    freq: spam[key],
                    amm: amm,
                    len: len
                 });
        
                await newSpam.save();
            }
        }
        resolve(1);
    });
}

module.exports = addToSpam;
