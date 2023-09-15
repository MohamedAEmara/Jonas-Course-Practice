// Calling this function returns an object that has a lot of built-in functions
// that allow you to deal with files
const fs = require('fs');

// .readFileSync()  ==>  takes two parameters (path, CHARACTER_ENCODING)
fs.readFileSync('./txt/input.txt', 'utf-8');
// this returns the text, so we need to store it in a variable in case we need  to use it later

const txt = fs.readFileSync('./txt/input.txt', 'utf-8');

console.log(txt);


const textOut = `This is what we know about avcado: ${txt}.\nCreated on ${Date.now()}`;
console.log(textOut);

// .writeFileSync()     ==>     takes two parameters (path, text_to_write)
fs.writeFileSync('./txt/output.txt', textOut);
