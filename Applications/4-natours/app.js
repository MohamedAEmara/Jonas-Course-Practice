const express = require('express');
const app = express();


// Import Routers for (users) & (tours)

const tourRouter = require(`${__dirname}/routes/tourRoutes`);
const userRouter = require(`${__dirname}/routes/userRoutes`);


const port = 8080;

app.listen(port, () => {
    console.log(`App listenning on port ${port} ....`);
});


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);



module.exports = app;

// here, we keep the application configuration in one standalone file...