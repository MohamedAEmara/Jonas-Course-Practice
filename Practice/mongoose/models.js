// Models in Mongoose is like "Class" in java
// We use Classes to create objects..
// We also use "Models" to create "Documents"

// To create "Model" we need a "Schema"
// We use "Schema" to: 
        // - Set default values
        // - Validate the data 
        // and so on..


const express = require('express');
const app = express();
const mongoose = require('mongoose');



const stringConnection = 'mongodb+srv://emara:P65t4sdVGsonWDFA@cluster0.we1vnfl.mongodb.net/natours?retryWrites=true&w=majority' 
mongoose.connect(stringConnection, {
    useNewUrlParser: true,
    userCreateIndex: true,
    useFindAndModify: false
})         
.then(con => {
    console.log(con.connection);
    console.log('DB connected successfully');
})




// To create a Schema, we create a new Ojbect from "Schema" as follows:

const schema1 = new mongoose.Schema({
    // here we define the fields with their types..
    // Types are Basic JS Types..
    name: String, 
    rating: Number,
    price: Number
});


// We can put some options for types of fields as follows..

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true
        // We can specify an error message when this required filed is missing..
        // By setting an array of two elements, the first element is true, the second is the message.
        required: [true, 'A tour must have a name'],
        unique: [true, 'A tour name must be UNIQUE']        // We cannot have two tours with the same name...
    },
    rating: {
        type: Number,
        // if we create a document with no rating, the rating will be set to "4.5"
        default: 4.5
    }, 
    price: {
        type: Number,
        required: true
    }
})


// Now, let's create a model out of this Schema..

// mongoose.model("Name Of Model", Schema);
const Tour = mongoose.model('Tour', tourSchema);
// It's a convention to use "Uppercase" in the first letter of the "model" name



// Now, let's create document out of that model..

const testTour = new Tour({
    // Here we pass the object data...
    name: 'Adventour',
    price: 20
});


// There are couples of functions on "testTour" that we can use to interact with...
// For example: .save() ==> this saves this to the tour collection in the database..
// This save returns a Promise that we can consume..
// and in .then() method, we have access to the document we just saved..

// testTour.save().then(console.log('happy happy happy'));
// NOTE: to be able to use .save() method, you have to connect to a database first...
testTour.save().then((doc) => {
    console.log('The collection saved successfully 😊')
    console.log(doc.name);
}).catch(err => {
    console.log('😔😔😔');
    console.log(err);
})
    

console.log(testTour.rating);       // 4.5  as it's the default value..

// NOTE: if we reload the file, it will give us an error as there is a document with the same "tour name"

