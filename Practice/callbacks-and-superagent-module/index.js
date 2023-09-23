const fs = require('fs');

/// to install "superagent" package, we first have to initialize Node_Modules using "npm init"
/// Then install the package: "$ npm i superagent"
const superagent = require('superagent');
// this modules is used to make get request and more stuff


fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
    console.log(`Breed: ${data}`);

    // To get an http request: 
    // & to get the data we have to put the  "end"  method. As follows: 
    superagent.get(`https://dog.ceo/api/breed/${data}/images/random`).end((err, data) => {
        if(err) {
            console.log('Error 😔')
            console.log(err);
        } else {
            console.log(data.body);     // to get the response...
            // That will result the image URL
            console.log(data.body.message);
            // Now to save that string in a string, we will use another callback function inside this callback

            fs.writeFile('dog-image.txt', res.body.message, err => {
                console.log('Error 😔😔');
            });
        }
    });

    
});

