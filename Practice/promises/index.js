const fs = require('fs');
const superagent = require('superagent');

// Basically, the module "superagent" supports for promises
// so, we can use them here  

// A promise is a solution for callback-hell (the trianglar nested shape)
// Instead of implementing the callback inside of the promise, we will pass it with a function (.then)
// the "then()" function will wait for the promise to get the data, then it will be executed.
// and the arguments in the primise function will be available for the .then() function to use.


// A promise as soon as it comes back with the data, is called a "resolved promise".
// but at the beginning, it's a pending promise 
// so, when it's successfully gets the data, it's called a "resolved promise".
// However, the "resolved promise" might not be always successful because there might have been an error.

// .then() works only when the resolved prmise is a success.
// but does nothing in case of error. 

// In case of error, we can chain another method called ".catch()"
// this function will called if there was an error.



fs.readFile('./dog.txt', (err, data) => {
    superagent
        .get(`https://dog.ceo/api/breed/${data}/images/random`)
        .then(res => {  
            console.log(res.body.message);

            
        })
        .catch(err =>  {
            console.log('Error XXXXXX');
        })
    
})