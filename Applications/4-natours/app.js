// here, we keep the application configuration in one standalone file...
const express = require('express');
const app = express();

// Import Routers for (users) & (tours)

// const tourRouter = require(`${__dirname}/routes/tourRoutes`);
const tourRouter = require('./routes/tourRoutesPro');
const userRouter = require(`${__dirname}/routes/userRoutes`);


// const port = 8080;

// app.listen(port, () => {
//     console.log(`App listenning on port ${port} ....`);
// });

app.use(express.json());

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);



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
