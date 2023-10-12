// This module contains all authentication stuff: login, signup, ...
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const encrypt = require('bcryptjs');


const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = catchAsync(async(req, res, next) => {
    // const newUser = await User.create(req.body);

    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    });
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
        return next(new AppError('Please enter your email and password'));
    }

    // 2- Check if user exists & password is correct..
    const user = await User.findOne({ email }).select('+password')       // Note that { email } is equivalent to { email: email } in ES6 
    // We set .select('+password') because it's be default (select:false) from the model
    // to be able to access it again we specify +password here
    console.log(user);

    // We have also to check the password. but first, we need to encrypt the entered password
    // to compare it with the one stored in the DB.
    console.log("🙋‍♂️🙋‍♂️");
    console.log(user.password);
    console.log(password);
    const correct = await user.isCorrectPassword(password, user.password); 

    if(!user || !correct) {
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