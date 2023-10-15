// This module contains all authentication stuff: login, signup, ...
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const encrypt = require('bcryptjs');
const crypto = require('crypto');


const { promisify } = require('util');

const sendEmail = require('../utils/email');

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
        photo: req.body.photo,
        role: req.body.role
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



// Now, we'll implement some authorization, to give the some access to specific users...
// Based on the type of the user, we give access to some routes...
// For example, "standard users" cannot delete tours ... 

// We'll add a middleware before deleting any tour..

// NOTE: we cannot pass paramters to middleware function, but we actually need to pass an array 
//       of authorized people that can delete tours ....
// So we'll create a wrapper function that returns a middleware function that we actually want to create.


exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // So, this function has access to roles..
        // users that have access are [roles]
        // so if the user is in this array return true..



        // Note that in the previous "middleware" (protect) we added a new object to "req", so, now we have access to it..

        if(!roles.includes(req.user.role)) {           // "indlues" is a js method that's availble on Arrays.
            next(new AppError(`You dont't have permission to perform this operation`, 403));        // 403  ==>   forbidden
        }


        // If all things are alright...
        next();     // go to the next middleware ==> deleteTour.
    }
}


// Now, we'll implement a Reset-Password function
// First, we'll send post request (forgotPassword) with email address.
// Then, create a "Reset Token" and send that to the email address that was provided..
// Just a simple random token, not  Json Web Token

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1- Get user based on POSTed email.
    const user = await User.findOne({ email: req.body.email });         // Get the email from the post request
                                                                        // We don't know ID, so used findOne()

    // Verify if the user exists??
    if(!user) {
        return next(new AppError('There is no user with that email', 404));
    }
    // 2- Generate the random reset token.
    const resetToken = user.createPasswordResetToken();


    // await user.save();      // Because the previous function modifies the document of the current user in DB
    // So, we need to save it.
    // But to save, we have to validate all the data in req.body

    // To deactivate all validators, we simply use this option..    { validateBeforeSave: false }   as a parameter in save()
    await user.save({ validateBeforeSave: false });
    // This is a very life-saver mongoose option, and there are a lot in documentation.. "No need to know them all just some search to find the what you want"

    console.log(resetToken);
    console.log()
    
    // 3- Send it back as an email.
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;


    const message = `Forget your password? Submit a PATCH request with you new password and confirmPassword to: ${resetURL}.\n`;


    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 mins)',
            message
        });
    
    
        res.status(200).json({
            status: 'success',
            message: 'token send to email'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Try again later..', 500));
    }

});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1- Get the user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');       // token is in the URL




    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}});

    // 2- if token has not expired, and there is user   ==>     set the new password
    if(!user) {
        return next(new AppError('Token is invalid or expired', 400));      // Bad Request.
    }


    user.password = req.body.password;      //   make the password entered by the user to the new user.
    user.confirmPassword = req.body.passwordConfirm;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // After modifying the document, save it..
    await user.save();          // Now, we won't turn off validators.. We need to check before save..

    // 3- Update changePasswordAt property for the user



    // 4- Log the user in, send JWT

    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token
    });
    
});