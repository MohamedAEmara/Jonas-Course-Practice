// In this project we will create some function to determine which is executing first

const fs = require('fs');
const crypto = require('crypto');

const start = Date.now();
console.log(process.env.UV_THREADPOOL_SIZE);

UV_THREADPOOL_SIZE = 2;         // change the size of thread pool from 4 to 2


console.log(process.env.UV_THREADPOOL_SIZE);

setTimeout(() => console.log('Timer 1 finished'), 0);
setImmediate(() => console.log('Immediate 1 finished'));



fs.readFile(`${__dirname}/test-file.txt`, () => {
    console.log('I/O Finished');

    setTimeout(() => console.log('Timer 2 finished'), 0);        
    setImmediate(() => console.log('Immediate 2 finished'));
});


console.log('Hello from top level code...');    // top level code means not inside any function body


crypto.pbkdf2('password', 'salt', 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
});

crypto.pbkdf2('password', 'salt', 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
});

crypto.pbkdf2('password', 'salt', 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
});

crypto.pbkdf2('password', 'salt', 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
});

crypto.pbkdf2('password', 'salt', 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
});



// Note that here we have 5 threads to encrypt the password and by default 
// the size of pool thread is 4
// so 4 of them will be executed at the same time and the fifth will be executed later.

// TO CHANGE THE POOL SIZE : 
    // process.evn.UV_THREADPOOL_SIZE = 1