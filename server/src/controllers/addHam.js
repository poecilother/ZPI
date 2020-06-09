const Ham = require('../models/ham');
const fs = require('fs');

async function addToHam(req, res) {
    try {
        req.setTimeout(60000000);
        console.log('Starting')

        amm = 2160;
        len = 179.2675925925926;
        
        content = fs.readFileSync('ham.json', 'utf8');

        console.log(content[604117])

        ham = JSON.parse(content)

        addToDatabase(ham).then(success => {
            return res.json({
                success: success
            });
        });
    } catch (err) {
        console.log(err);
    }
}


async function addToDatabase(ham) {
    return new Promise(async (resolve, reject) => {
        console.log('Start adding to database')
        for (key in ham) {
            //console.log(key)
            const foundWord = await Ham.findOne({
                'word': key
            });
        
            if (!foundWord) {
                const newHam = new Ham({
                    word: key,
                    freq: ham[key],
                    amm: amm,
                    len: len
                 });
        
                await newHam.save();
            }
        }
        console.log('Added to database')
        resolve(1);
    });
}

module.exports = addToHam;
