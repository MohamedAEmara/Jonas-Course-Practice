// It's a best practice to keep the files that are related to "EXPRESS" in one file
// and every thing related to "the server" in another main file


// server.js   is where every thing starts..

// in order to have access of "environment-variables"
// in our app, we import it first...
const dotenv = require('dotenv');
const app = require('./app');
dotenv.config({path: './config.env'});

// Import mongoose module to be able to interact with remote databases.
const mongoose = require('mongoose');


// To start a connection with some mongo database we use "mongoose.connect(<CONNECTION_STRING>)"
let stringConnection = process.env.DATABASE;
const DB = stringConnection.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
// console.log(stringConnection);
mongoose
  .connect(DB, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'))
  
  // Before we add .catch() method, node doesn't know what to do in case of promise rejection..
  // It will return "Unhandled Promise Rejection" in the console..

  // .catch((err) => {
  //   console.log(`Can't connect to the Database ❌❌`);

  // })
// console.log(process.env.DATABASE);
// console.log(process.env);

// To get the environment variables we're on now..
console.log(app.get('env'));        // development..
// Environment Variables: are global variables that are used to define the environment
// in which a node app is running ...
// This value is set by "Express"


// There are a punch of variables that are located in "process.env"




const port = 2000;
app.listen(port, () => {
    console.log(`App running on port ${port} ...`);
})

// NOTE:: to run "server.js" as our main entry file
// we have to change it from the configuration file (package.json)
// and make ==> "main": "server.js"
// and add a script ==> "start": "nodemon server.js"

// So, when I hit "$ npm start" ==> it will automatically execute the code
// for "$ nodemon server.js"




// Now, we're gonna add a global handler for "Unhandled Promise Rejection"
// Note: when there is a rejection from a promise that's not handled, it emits a "Unhanlded Promise Rejection"
// that we can listen for..

process.on('unhandledRejection', (err) => {
  console.log('😔😔');
  console.log(err.name, err.message);

  // To Shut Down the application we use:
  // process.exit(1);      // code (0) ==>  stands for success && (1)  ==>  stands for unCaught Exception.

  // We can also give the server some time to finish all the requests that are still pending..
  // After that the process will be killed.
  server.close(() => {
    process.exit();
  }) 
})