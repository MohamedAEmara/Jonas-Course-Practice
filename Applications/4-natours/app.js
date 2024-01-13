// here, we keep the application configuration in one standalone file...
const express = require('express');
const app = express();
const helmet = require('helmet');
const Mongosanitize = require('express-mongo-sanitize');
const xss = require('xss-clean')
// Now, we'll use a middleware for best bractices for security..
// It's called "helmet"
// npm i helmet
app.use(helmet());
// NOTE: in app.use() we need to pass a (function) NOT a (function call)
// It's best practice to put it as a "first middleware"
const rateLimit = require('express-rate-limit');



// process.env.NODE_ENV = 'production';
// Import Routers for (users) & (tours)

// const tourRouter = require(`${__dirname}/routes/tourRoutes`);
const tourRouter = require('./routes/tourRoutesPro');
const userRouter = require('./routes/userRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');

// const port = 8080;

// app.listen(port, () => {
//     console.log(`App listenning on port ${port} ....`);
// });

app.use(express.json({ limit: '10kb' }));        // We can limit the size of the data in the body using "limit"


// Data Sanitization against NoSQL query injection:
// Query injection is to write a "NoSQL" code instead of a plain object
// This query will be executed and returns retults from DB

// npm i express-mongo-sanitize
// npm i xss-clean 

app.use(Mongosanitize());     // This will filter out all "." and "$" from (req.params) or (req.body) 


// Data Sanitization against XSS attacks
app.use(xss());
// This will protect us from any JS code attached to the request..

app.use((req, res, next) => {
    console.log('❤️❤️❤️');
    req.requestTime = new Date().toISOString();
    console.log(req.headers);
    next();
})


// Implement Rate-Limiter to prevent attackers from login many times or slow down the response of our application
// We use "express-rate-limit" module for that..

// rateLimit is a function that recieves an object of options..
const limiter = rateLimit({
    // Here we specify how many requests of the same ID we want to allow in a certain amount of time..
    
    // We'll make it 100 requests per hour
    max: 100,
    windowMs: 60 * 60 * 100,
    
    // message when this limit is exceeded.
    message: 'Too many request from this IP!! Please try again in an hour.'
    // statusCode: 429 (too many requests)
});
// This function creates a "middleware" function, 
// that we can use using "app.use()"
app.use('/api/', limiter)       // only use "limiter" on requests from "/api"

// NOTE: We'll get in the "headers" tab a new properties like:
// RateLimit-Limit: value
// RateLimit-Remainnig: value


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.use('/api/v1/bookings', bookingRouter);
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