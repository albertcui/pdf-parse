const Fs = require('fs');
const Pdf = require('./lib/pdf-parse.js');

module.exports = Pdf;

//for testing purpose
if (!module.parent) {

    let PDF_FILE = './test/data/04-valid.pdf';
    let dataBuffer = Fs.readFileSync(PDF_FILE);
    Pdf(dataBuffer).then(function(data) {
        Fs.writeFileSync(`${PDF_FILE}.txt`, data.text, {
            encoding: 'utf8',
            flag: 'w'
        });
        debugger;
    }).catch(function(err) {
        debugger;
    });

}
