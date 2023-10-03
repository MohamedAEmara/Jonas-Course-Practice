// Now, we'll build a script to load data from a JSON file into our database

const fs = require('fs');                   // we need to access file system module, because we want to read JSON files.
const dotenv = require('dotenv');           // we need dotevn to be able to connect to database.
dotenv.config({path: './config.env'});  

const Tour = require('../../models/tourModel');     // We need to access Tour model 
const mongoose = require('mongoose');   

let stringConnection = process.env.DATABASE;
const DB = stringConnection.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));


// Read the JSON file...
// const tours = JSON.parse(fs.readFileSync('./tours-simple.json', 'utf-8'));
// Note, the ./ way is relative to the root file not the current file
// so, it's safer to use (__dirname) variable instead..
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));


// Import data into Database...
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('data successfully Loaded 😊');

        // Note that the process will still running even after deleting all the document.
        // To exit the process, simply use "process.exit()"
        process.exit();
    } catch (err) {
        console.log(err);
    }
}


//  I can use the IIFE method to directly execute this function whenever the module loads...
// (async () => {
//     try {
//         await Tour.create(tours);
//         console.log('data successfully Loaded 😊');
//     } catch (err) {
//         console.log(err);
//     }
// })()



// Delete all data from collection...
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('all documents deleted successfully 💥');

        // Note that the process will still running even after deleting all the document.
        // To exit the process, simply use "process.exit()"
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

// importData;




console.log(process.argv);          
// This logs an array of 2 arguments of running this node process.
// The first one is where "node" command is located.
// And the second on is where the file we're running is located..

// We can add more element to this array
// by sending them with the command "$ node <file>.js blabla"

// The use of this is we can specify what actually we want the script to do, if the script contains more than one fuction...
// We simple can access them using [] 


if(process.argv[2] === '--import') {
    // Call the function of importing tours-simple.js
    importData();
} else if(process.argv[2] == '--delete') {
    deleteData();
}



