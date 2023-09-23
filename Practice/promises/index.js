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


// -----------------------------------------------------------------------
// Instead of this way, we will make another way using promises in reading files 

// Let's create a function that returns a promise.
// and use it in reading files..
const readFilePro = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            resolve(data);      // Whatever value we pass into the resolve function, 
                                // is what will be later available as the argument in "then" method. 
            // And this data here will be the value that this promsie returns to us.  
            
            // reject function is the function that's called when there is an error in the promise.
            // which will be available later in "catch" method..
            if(err) {
                reject('I could not find that file 😔');
            }
        });


    });
};

// The above function is just to know how promises work internally, but there is a built-in 
// function that automatically promisify functions for us.


// The write function needs another paramter which is the data to write in that file.
const writeFilePro = (file, data) => {
    return new Promise((resolve, reject) => {
        // fs.writefile takes the two paramters (file, data) and one more parameter which is the callback function.
        fs.readFile(file, data, (err) => {
            if(err) reject('Could not write file 😔😔');
            resolve('success ✅');
        })
    })
}







// Let's use readFilePro
readFilePro(`${__dirname}/dog.txt`)
    .then(data => {
        superagent
        .get(`https://dog.ceo/api/breed/${data}/images/random`)
        .then(res => {  
            console.log(res.body.message);


        })
        .catch(err =>  {
            console.log('Error XXXXXX');
        })
    
    })
    .catch(err => {
        console.log()
    })



// =====================================================================================

// The problem with the previous function is that it still uses a callback inside a callback
// To make it look better, we'll use chaining...
// By making every function return a promise so that we can use .then afterwards..

// The final version applies what we've just talked about.....


readFilePro(`${__dirname}/dog.txt`) // we can use the first .then() as the readfilePro returns a promise.
    .then(data => {
        console.log(`Breed: ${data}`);
        return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);   
        // it returns a promose, so we can chain the next then()...
    })
    .then(res => {
        console.log(res.body.message);
        return appendFilePro('dog-file.txt', res.body.message);
        // it also returns a promise, so we can chain the next .then()
    })
    .then(() => {
        console.log('Random dog image saved to file!');
    })
    .catch(err => {
        console.log('I cannot read the file 😔😔😔');
    });
    // Just one error handler (catch) to handle an error coming from each of the three promises..



// Now let's create a same function but appends a new line with the image URL.. not just writing.




const appendFilePro = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.appendFile(file, data, err => {
            if(err) reject('Cannot Write to the file 😔');
            resolve('Write Successfully ✅');
        });
    })
}