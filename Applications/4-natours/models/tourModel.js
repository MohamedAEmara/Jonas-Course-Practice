const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true
    },
    rating: {
        type: Number,
        // if we create a document with no rating, the rating will be set to "4.5"
        default: 4.5
    }, 
    price: {
        type: Number
        // required: true
    }
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
// Here, we export the Tour model
// Actually, we will use them in "tourController" in order to create, delete, update, ...
