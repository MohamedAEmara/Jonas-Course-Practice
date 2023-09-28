const express = require('express');
const app = express();

// To get the environment variables we're on now..
console.log(app.get('env'));        // development..
// Environment Variables: are global variables that are used to define the environment
// in which a node app is running ...
// This value is set by "Express"


// There are a punch of variables that are located in "process.env"
console.log(process.env);


// To set or add some env-var, we can pass it as a key-value before "nodemon server.js"
// for example : $ NODE_ENV=development x=123 nodemon server.js


// But it's not practical to do it this way specially when there are many variables..
// In these cases we've to create "config.env" file that    

// To deal with that config file ==> first, install ".evn" module
// $ npm i dotevn
// After that, require that module...

const dotenv = require('dotenv');

// to use some config file using this module...

dotenv.config({path: './config.env'});      // specify the path of "config file"..
// this command will read our variables from this path..



console.log(process.env.USER);      // 'mohamed'
console.log(process.env.PASSWORD);  // 123456
console.log(process.env.PORT);      // 8000
// These variables are defined in "config.env"


// one of the uses of these variables...
// is that we use PORT on our machine in "development" 
// but in production, there is no use for that.
// So, we can check for the values of these variables to 
// do something..

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


// if the value of PORT is not defined in "environment variables"
// it will use the port = 3000.

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port} ...`);
})

// NOTE:: to run "server.js" as our main entry file
// we have to change it from the configuration file (package.json)
// and make ==> "main": "server.js"
// and add a script ==> "start": "nodemon server.js"

// So, when I hit "$ npm start" ==> it will automatically execute the code
// for "$ nodemon server.js"