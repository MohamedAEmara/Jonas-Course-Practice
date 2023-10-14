// This module contains all authentication stuff: login, signup, ...
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const encrypt = require('bcryptjs');

const { promisify } = require('util');

const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = catchAsync(async(req, res, next) => {
    // const newUser = await User.create(req.body);

    console.log(req.body);
    console.log('.......................');
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        passwordChangedAt: req.body.passwordChangedAt,
        photo: req.body.photo
    });
    console.log(newUser);
    // In the new version, we only allow fields tha we actually need to but in the new user document


    // .sing(payload, secret)
    
    // const token = jwt.sign({ id: newUser._id }, 'secret', process.env.JWT_SECRET);
    
    // Now, the token header will be created..
    // We can also specify a vlid time for this token.. and after that it's not valid any more..
    // so, we'll add an additional security measure..
    // by passing options as an Object.

    const token = signToken(newUser._id);

    // Now, as we created the token, we have to send it back to the client..

    res.status(201).json({
        status: 'success',
        data: newUser,      // Note that it's a good practice to hide the encrypted password
        token               // from the user.
        // So, we'll execlude it by specifying "select :false" in User Model
    });
});


 



exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    
    // 1- Check if email & password exists..
    if(!email || !password) {
        // Call the next middleware and pass "err"
        return next(new AppError('Please enter your email and password', 400));
    }

    // 2- Check if user exists & password is correct..
    const user = await User.findOne({ email }).select('+password')       // Note that { email } is equivalent to { email: email } in ES6 
    // We set .select('+password') because it's be default (select:false) from the model
    // to be able to access it again we specify +password here
    console.log(user);

    if(!user) {
        return next(new AppError('Incorrect email or password', 401));      // 401  ==>  UnAuthorized       
    }
    // We have also to check the password. but first, we need to encrypt the entered password
    // to compare it with the one stored in the DB.
    console.log("🙋‍♂️🙋‍♂️");
    console.log(user.password);
    console.log(password);
    const correct = await user.isCorrectPassword(password, user.password); 

    if(!correct) {
        console.log(user);
        console.log(correct);
        return next(new AppError('Incorrect email or password', 401));      // 401  ==>  UnAuthorized       
    }
    // 3- If everything is OK, send the token to the client..
    const token = signToken(user._id);
    

    res.status(200).json({
        status: 'success',
        token
    });
});



exports.protect = catchAsync(async (req, res, next) => {
    // 1- Getting the token & Check of it's there.
    // The token header is sent with the request in headers as follows:
    // {authorization: 'Bearer aasdjlfkjasdflkj'}       // the random string here is an example of "token"
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        return next(new AppError('You are not logged in!! Please login to get access.', 200));  // 401 ==> UnAuthorized.. 
    }

    // 2- Verification token
    // jwt.verify()     ==>     takes 3 parameters (token, secret, callback)
    
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);
    /// decoded is an Object carrying {id, iat, exp}
    
    
    // 3- Check if the user accessing the route exists..  
    /*
        What if the user changed his password or deleted his account.
        we want to prevent him from accessing protected routes..
    */
    // We stored the user_id in the payload to be able to access the user using it..    
    const currentUser = await User.findById({_id: decoded.id})

    if(!currentUser) {
        console.log('The Token belonging to this user does no longer exists!!');
        return next(new AppError('The Token belonging to this user does no longer exists!!', 200));
    }

    // console.log('🪟🪟🪟');
    // 4- Check if user changed password after the token was issued 
    if(currentUser.changePasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password, Please login again..'));
    }



    // If all previous checks are Ok, just go to the next() middleware..

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
})