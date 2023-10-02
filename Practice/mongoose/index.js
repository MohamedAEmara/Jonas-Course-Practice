// mongoose is a JS module that makes interacting with mongo databases easier..
// To install "mongoose", simply we use 
    // $ npm i mongoose@5

// Mongoose is an Object Data Modelling (ODM) library for MongoDB and NodeJS providing a higher level of abstraction 
// It's like the relationship between "Express" and "Node"


// Mongoose Schema: where we model our data, by describing the structure of the data, default values, and validations.

// Mongoose Model: a wrapper for the schema providing and interface to the database for "CRUD" operations..


///////////// NOTE: @5 ==> this is a more stable version..

const express = require('express');
const app = express();

// To be able to use mongoose function, just import it in your file..
const mongoose = require('mongoose');


// We get this connection from our "MongoDB" using connect  >>  Drivers  >> "choose NodeJS"
const stringConnection = 'mongodb+srv://emara:P65t4sdVGsonWDFA@cluster0.we1vnfl.mongodb.net/natours?retryWrites=true&w=majority' 


// To connect to the MongoDB, we use .connect() function...
mongoose.connect(stringConnection, {
      
    // For now, just do the same options with your connection..
    useNewUrlParser: true,
    userCreateIndex: true,
    useFindAndModify: false
})         // This connect method will return a "Promise", 
// We can actually handle this promise by using ".then()"
// And this .then() has access to "Connection Object"
.then(con => {
    console.log(con.connection);
    console.log('DB connected successfully');
})


// Woooooooooooooow, our connection works properly for now 😀