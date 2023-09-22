// console.log(arguments);
console.log(require('module').wrapper);
// O/P:     (function(exports, require, module, __filename, __dirname))



const C = require('./calculator');
// Now we can use C the same as Calculate but in this file
const c = new C(); 

console.log(c.add(4, 10));          // 14
console.log(c.multiply(12, 10));    // 120



// IMPORTING the second module "test-module-2.js"

const Calaculator2 = require('./test-module-2');

console.log(Calaculator2.add(10, 40));      // 50
console.log(Calaculator2.divide(10, 5));    // 2



// WE can also import functions from the class as follows:

const { add, divide } = require('./test-module-2');

console.log(add(1, 2));
console.log(divide(10, 4));



// Cashing ..
require('./test-module-3')();       // I'm calling the function directly without saving it in a variable.


require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();