const AppError = require("../utils/appError");

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
            message: 'something went wrong'
            // err: err
        }); 
    }
}


const handleCastErrorDB = (err) => {
    // We have "path"   ==>     that field caused the error. 
    // and "value"      ==>     the value for that field that caused the error.

    const msg = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(msg, 400);      // 400 stands for "Bad Request"..
}


const handleValidationErrorDB = (err) => {
    // Loop over "errors" array and take all the "message" from the filds that has name = 'ValidationError'
    let error = {...error};
    let msg = "";

    error = error.errors;
    // error.forEach(el => {
    //     if(el.name == 'ValidatorError') {
    //         msg.concat(`  ${el.message}`);
    //     }
    // });

    // const msg = err.errors.name.message;
    return new AppError(msg, 400);
}

const handleDuplicateFieldsDB = err => {
    const msg = `The name ${err.keyValue.name} is alreaday taken !!! .. Please try another tour name`;
    return new AppError(msg, 400);
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
        console.log('😊development😊');
        sendErrorDev(err, res);
    } else if(process.env.NODE_ENV === 'production') {
        console.log('😔production😔');
        // return res.json({
        //     error: err
        // })
        let error = {...err};       // create a new copy of err and save it in "error"
        console.log('error.name = ' + error.name);
        console.log(err);
        // CastError ==> are the errors coming from databases..
        console.log(err.CastError);
        if(err.name == 'CastError') {  // There are error coming from databases..
            // console.log('😊😊😊');
            error = handleCastErrorDB(err); 
        }
        // Now, the message is clear for user: "Invalid_id: fff."
        
        


        // Now, let's handle the error message when you create a duplicate-name document..
        // To identify these error, we used the unique error code : ""
        
        if(err.code === 11000) error = handleDuplicateFieldsDB(error);
        
        console.log("=======================")
        console.log(err.errors.name);
        console.log("=======================")
        console.log(err.errors);
        console.log("=======================")
        if(err.errors.name.name === 'ValidatorError') {
            error = handleValidationErrorDB(error);
        }
        
        sendErrorProd(error, res);
    }

}


