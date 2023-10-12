// here, we keep the application configuration in one standalone file...
const express = require('express');
const app = express();

// process.env.NODE_ENV = 'production';
// Import Routers for (users) & (tours)

// const tourRouter = require(`${__dirname}/routes/tourRoutes`);
const tourRouter = require('./routes/tourRoutesPro');
const userRouter = require('./routes/userRoutes');

const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');

// const port = 8080;

// app.listen(port, () => {
//     console.log(`App listenning on port ${port} ....`);
// });

app.use(express.json());

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);



// If I add any middleware here after app.use() .. this means this route is not handled by each of the above routers..


// We want to handle any route that's not '/api/v1/tours' or '/api/v1/users'
// So any other route will handled by the same following handler..  
// .all method is run by all requests, {post, get, patch, ...}
app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Cannot find ${req.originalUrl} on this server!!`
    // });

    // Let's create an error Ojbect.
    const err = new Error(`Can't find ${req.originalUrl} on this server..`);        // the string in Error() is the message we use below.
    err.status = 'fail';
    err.statusCode = 404;

    // After defining the error, we have to call next() to be able to move to the next middleware..
    // But we should pass the error object in the next().
    // NOTE: any argument that passed in the next() function is (ERROR Object) 
    // next(err);  
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})


// Now, we'll implement a global error handling middleware 
// When we use a callback function with 4 parameters, Express recognises that it's an error handling middleware.


// Now, we execluded this body in an external controller "errorController"
/*
app.use((err, req, res, next) => {

    console.log('❌❌❌❌❌');
    console.log(err.stack);
    // This is a general error handling. So, we don't know exactly what is the status code caused this error.
    // The best way is to read the status code from the "Error Object".
    // Note: some errors are not defined..
    // So, we'll check for the value of "statusCode" and if it's not defined we'll set a default of (500) internal server error.
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    res.staus(err.statusCode).json({
        status: err.status,
        message: err.message
    });
})
*/

// Simple we just want to use the errorController..
app.use(errorController);  

// Note we cannot access files from the working directory in the URL follwing the url with
// /dev-data/data/users.json    for example
// This cannot be done in the browser..
// This can be done just using (routes)

// Another way is using "express.static()"
// Files from your local directory are called "Static Files"
// To access Static Files, we have to use built-in middleware "express.static()"
// and in static() function we pass the directory where we want to server static files...
// app.use(express.static(`${__dirname}/public`));

// Now we can access all files related to the root "public" using '/'
// GREATTTTT..


module.exports = app;