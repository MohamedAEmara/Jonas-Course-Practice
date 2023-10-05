const mongoose = require('mongoose');

const slugfiy = require('slugify');


const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true
    },
    slug: String,
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
    startDates: [Date],          // Dates the tour starts, for example there is a tour next December, and anther one in February
    secretTour: {
        type: Boolean,
        default: false
    }
},
{
    toJSON: { virtuals: true},          // This tells our schema to show (virtual properties)      
    toObject: { virtuals: true}         // Also when data is outputted as an Object. virtual properties will be displayed
})



// =============================== Virtual Properties ====================================== // 
// We sometimes need to store some properties like: "distance in Kilometres and Miles"
// No need to store both them in our database as one can be deriven from the other one..
// This is an unnecessary Overhead..


// NOTE: we cannot use arrow function in the callback function inside .get() 
// As the arrow function doesn't support "this"

// The .get() method will be called everytime we want to show this fitual property..
tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;       // "this" here refers to (the current document)
})

// The default of the (virtual properties) is "hidden" in the results..
// to show them, you have to explicitly set {toJSON: {virtuals: true}} in our Schema

// Note: (virtual properties) can't be used in filtering methods.. 
// We CANNOT say  Tour.find({durationWeeks: {$gt: 30}})  XXXXXXX



// ================================================= Mongoose Middlewares ===========================================

// There are 4 types of middlewares in "Mongoose"

/*
    1- Document
    2- Query
    3- Aggregate
    4- Model Middleware
*/


// 1- Document Middleware
// The middleware that can act on the currently processed document.


// pre() is a middleware that runs before and actual event 

// The middleware function has access to next() 
tourSchema.pre('save', function(next) {     // The event in this case is "save" event.
    // here the function that will be executed before the .save() execution..
    // this .pre() can be applied with {'save' or 'create'}    BUT NOT "insertMany"

    console.log(this);

    this.slug = slugify(this.name, { lower: true});     
    // Here we defined a new property that's not defined in the Schema, so it will not save to the database. 
    // Now I defined it in the schema, so we'll be able to see it in the resutls...

    next();         // As express middlewares, we want to call the next middleware in the stack.
})              
// In order to trigger the previous middleware, we have to apply .save() command or .create() command.



// Middleware is also called "Hooks"

// As we know, we can have more than one of the same middleware 

tourSchema.pre('save', function(next) {
    console.log('Will save the document...');
    next();
})



// Now, let's move to post() middleware..
// it executes after a certain event..
tourSchema.post('save', function(doc, next) {
    console.log(doc);

    next();
})



 
// 2- Query Middlewares..
// It allows us to run some middleware before or after some query..

// in this hock we'll be processing the query (find) not a document..

// EXample Use Case: 
/*
    if there are secret tours that can be used only by VIP..
    So, we want to hide them from ordinary users.

    // let's go and add a property in our schema "secretTour" which can be {true, false}
*/
tourSchema.pre('find', function(next) {
    // We can chain .find() as (this) basically is a query..
    this.find({ secretTour: {$ne: true} });           // filter out all secret tours before applying any find method
    // Note: we didn't say "secretTour: false" as it may be "undefined"

    next();
})

// Note: if we findById a (secret tour), it will be shown as the hook here is only applied
// on .find() not .findOne() method..

// To solve this problem we can implement another hook for (findOne)
// But a better way is to implement a "regular expression" instread..


tourSchema.pre(/^find/, function(next) {        // Any string that starts with "find" will be included..
    this.find({secretTour: {$ne: true}});

    next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
// Here, we export the Tour model
// Actually, we will use them in "tourController" in order to create, delete, update, ...

