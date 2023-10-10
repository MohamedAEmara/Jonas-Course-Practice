const sendErrorDev = (err, res) => {    // we need to pass "res" to be able to send the response..
    // In development, no problem to send all info about the error..
    console.log('❌DEVELOPMENT❌');
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    });
}

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client.
    if(err.isOperational) {
        console.log('OPERATIONAL ERROR 💥');
        res.status(err.statusCode).json({
        status: err.status,
            message: err.message
        });


    // Programming or other unknown errors: don't leak error details to the client.
    } else {
        console.log('OTHER ERROR ❌');
        // Send a generic error message..
        res.status(500).json({
            status: 'error',
            message: 'someting went wrong'
        }); 
    }
}

module.exports = (err, req, res, next) => {
    // To see the path that caused the error..
    console.log(err.stack);
    console.log(err.statusCode);
    console.log(err.status);     
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    console.log(process.env.NODE_ENV);

    if(process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if(process.env.NODE_ENV === 'production') {
        sendErrorProd(err, res);
    }

}