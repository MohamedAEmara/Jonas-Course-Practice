module.exports = fn => {
    // Note that fn is an async function that returns a "Promise"
    // So, we can attach .catch() 
    
    
    // console.log('❌❌❌');
    
    // We return a function not a returned value from a function.
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }   
}

