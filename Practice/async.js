// Synchronous is the code that's executed line by line 
// So, the processing of line 2 can't get executed until the 1st line finishes
// it also called "Blocking". As the execution of line 2 is blocked till the execution of the first line

// Let's see an example to illustrate the use of "Async" in Node

const fs = require('fs');
const input = fs.readFileSync('./txt/input.txt', 'utf-8');

console.log(input);     // it takes some moments to execute 
console.log('Hello, there');


// but in some cases, we want to continue executing other lines of code
// without waiting for this function to execute 
// In such case, the importance of Async functions coems...

// The async function takes one more parameter which is a callback function

fs.readFile('./txt/input.txt', 'utf-8', (err, data) => {
    console.log(data);
});

console.log('Reading Files...');    // This will be printed first.
// So, this code this way is "Non-Blocking"


// Callback-Hell   -->    This happens when you have many async functions one each another.
// Like this:

fs.readFile('./txt/data1.txt', 'utf-8', (err, data1) => {
    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
        console.log(data1);
        console.log(data2);

        // Write in async functions,
        // in call_back function, there is no data , just err as an argument.
        fs.writeFile('./txt/data3.txt', `${data1}\n${data2}`, (err) => {
            console.log('Write successfully 😊');
        });
    });
});

// In the previous example the second function depends on the success of the first function.

