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
tourSchema.pre('save', function() {     // The event in this case is "save" event.
    // here the function that will be executed before the .save() execution..
    // this .pre() can be applied with {'save' or 'create'}    BUT NOT "insertMany"

    console.log(this);
})              
// In order to trigger the previous middleware, we have to apply .save() command or .create() command.
