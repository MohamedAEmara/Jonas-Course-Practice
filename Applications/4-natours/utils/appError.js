// build error handler class that extends the built-in Error class 
class AppError extends Error {
    constructor(message, statusCode) {
        // But in the built-in Error class, only message is the parameter 
        super(message);

        this.statusCode = statusCode;
        
        // We didn't pass the status as a parameter as it depends on the "StatusCode"
        // 400      ==>     fail
        // 500      ==>     error
        // Not only 400 status is fail, But all status codes that begins with 4xx..

    
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        // We used `backticks` to convert "statusCode" into String... so that we can apply startsWith method on it.
        
        this.isOperational = true;      
        // Now, we built the Error Class that can be used in all Operational Errors.
        Error.captureStackTrace(this, this.constructor);
        
        this.message = message;
        console.log('❎❎❎');
        console.log(this);
    }
}


module.exports = AppError; 