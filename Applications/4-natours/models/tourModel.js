const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour should have a difficulty']
    },
    ratingAverage: {
        type: Number,
        default: 4.5
    },
    ratingQuantity: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        // if we create a document with no rating, the rating will be set to "4.5"
        default: 4.5
    }, 
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,          // trim works only with "Strings", Note that every typy have their own (schema types)
        // This shema type trims all white spaces at the beginning and at the end..
        required: [true, 'A tour must have a summary' ]
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,           // The name of the image to use to get the image from the file system..
        required: [true, 'A tour must have a cover image']
    },
    images: [String],           // if there is on image or more, so we use an array of strings
    createdAt: {
        type: Date,             // Date is a standard JS data type
        default: Date.now(),
        // NOTE:::::::::::: we can hide some properties by default in the result for users..
        select: false      // by specifying select: false.
    },
    startDates: [Date]          // Dates the tour starts, for example there is a tour next December, and anther one in February
    

})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
// Here, we export the Tour model
// Actually, we will use them in "tourController" in order to create, delete, update, ...

