module.exports = (err, req, res, next) => {
    // To see the path that caused the error..
    // console.log(err.stack);
     
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    console.log('❌❌❌');
    
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
}