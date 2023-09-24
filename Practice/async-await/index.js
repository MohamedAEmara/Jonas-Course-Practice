// A better and easier way to git rid of "CallBack Hell" is (async-await)...
const fs = require('fs');
const superagent = require('superagent');



const readFilePro = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if(err) {
                reject('I could not find that file 😔');
            }
            resolve(data);   
        });
    });
};


const appendFilePro = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.appendFile(file, data + '\n', err => {
            if(err) reject('Cannot Write to the file 😔');
            resolve('Write Successfully ✅');
        });
    })
}


// Handling errors in async-await method is nothing new, it's the standard of JS. 
// Which is to wrap the code with "Try & Catch" blocks.

const getDogPic = async () => {
    try {
        // inside an async function, we can one or more await expressions.
        // And also we can save them in files..
    
        const data = await readFilePro(`${__dirname}/dog.txt`); 
        // The above code will stop the code from running until the promise "readFilePro()" is resolved.
        // This makes the code looks more synchronous while it's in fact "Asynchronous" behind the scenes.
    
        console.log(`Breed: ${data}`);
    
    
        const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        console.log(res.body.message);
    
        const write = await appendFilePro(`${__dirname}/dog-file.txt`, res.body.message);
        console.log('Write Successfully ✅');
    
    } catch(err) {
        // console.log(err);
        throw (err);
    }


    // We also can return a value from an "async" functions...
    return 'Ready 🐶';
    // Buttttttttttttttttttt...
    // the async functions returns a "Promise" and the variable doesn't know that 
    // the function returned this string.

    

    // But if we wanted to return that string. 
    // We have to call it below with .then() method

    
    // But there is still a problem which is "The string always returns" even if there is an error.
    


    // To return an error that can be found below in the caller function, we have to throw an error in the catch handler
    // in order to get an error detected below in the .catch() 

}
// NOTE: We CANNOT use "await" outside of "async" function..

console.log('1: Will get dog pics!!');
const dogg = getDogPic();       // the value in dogg is "Promise {<pending>}"
// console.log(dogg);


// But to get the string value in the return "At the end of the function"
// We have to wait till the function finishes its execution..
// using .then() method

getDogPic()
    .then((x) => {   // "x" here is the returned value from the function (getDogPic)
        console.log(x);     
    })
    .catch(err => {
        console.log('There is an error in getDogPic() function ❌');
    });


// getDogPic() is a function that returns a promise, so I can use .then() to access its future value.

console.log('2: Done getting dog pics :)');



// ================================================================================================
// ================================================================================================


// another way to call this function is IIFE (Immediately Invoked Function Expression)

(async () => {
    try {
        console.log(`1: Get the dog pics!!`);

        const x = await getDogPic()
            .then((x) => {
                console.log(x);
            })
            .catch(err => {
                console.log('CANNOT READ THE FILE ❌');
            })
        console.log(`3: Done getting dog pics!!`);
    } catch(err) {
        console.log('ERROR 💥');
    }
})()