const fs = require('fs');
const express = require('express');
const app = express();
const morgan = require('morgan');

// Note the order of the middleware execution is the order of them in the source code..
// routes are also middle ware that are only applied to certain URL..
// an example of using middleware:
app.use(express.json());    // in order to be able ot parse the data from body..
// Now, express.json() is added to the middleware stack..

// We also can create our own middleware 


app.use(morgan('dev'));
// This middle ware allow us to see the request info in terminal...
// GET / 200 7.233 ms - 64
// like this: 
/* 
    GET     ==>     http method
    200     ==>     status code
    7.233ms ==>     time of response
*/

// Actually, the callback function can have 3 parameters "request", "response", "next"
// This will be applied to every single request not matter what the router is..
app.use((req, res, next) => {
    console.log('Hello from the middleware 🙋‍♂️');
    // We have to call the next callback function, otherwise, the request will be stuck.
    // and we won't be ablo to move on or send back a response..
    next();
})

app.use((req, res, next) => {
    console.log('Hello from the middleware 😊😊');
    // We have to call the next callback function, otherwise, the request will be stuck.
    // and we won't be ablo to move on or send back a response..
    next();
})



app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();       // This will give us info about when request happends
    // This line adds "requestTime" to our request...
    // We can use it in the next requests...
    next();
    // without next() the response will stuck and request will not end...
})

const port = 8080;
app.listen(port, () => {
    'App Listenning to the port 8080....';
});


app.get('/', (req, res) => {
    console.log("Request Time: " + req.requestTime);
    res.status(200).json({
        'status': 'success',
        data: {
            'body': 'I am testing the rourt...'
        }
    });
})



// Note, this middleware fucntion won't be executed..
// As the previous middleware doesn't have "next" and send the result with
// res.json() ==> so the request cycle ends..
app.use((req, res, next) => {
    console.log('Hello from the middleware after the app.get');
})

// So, we usually define these methods at the top of the module before any routes.. 