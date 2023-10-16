// const fs = require('fs');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');



// filterObj(req.body, 'name', 'email');
const filterObj = (bodyObj, ...fields) => {
    let ret = {};
    
    Object.keys(bodyObj).forEach((el) => {
        if(fields.includes(el)) {
            ret[el] = bodyObj[el];
        }
    })
    //bodyObj.forEach(el => fields.includes(el));
    console.log(bodyObj);
    console.log('🅿️🅿️🅿️');
    console.log(ret);
    return ret;
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});

exports.createUser = (req, res) => {
    // NOT IMPLEMENTED YETTTTTTTT...
    // just returns 500 ==> Internal Server Error..

    res.status(500).json({
        status: 'error',
        message: 'This route is not implemented yet 😔'
    });
};


exports.getUser = (req, res) => {
    // NOT IMPLEMENTED YETTTTTTTT...
    // just returns 500 ==> Internal Server Error..

    res.status(500).json({
        status: 'error',
        message: 'This route is not implemented yet 😔'
    });
};

exports.updateUser = (req, res) => {
    // NOT IMPLEMENTED YETTTTTTTT...
    // just returns 500 ==> Internal Server Error..

    res.status(500).json({
        status: 'error',
        message: 'This route is not implemented yet 😔'
    });
};

exports.deleteUser = (req, res) => {
    // NOT IMPLEMENTED YETTTTTTTT...
    // just returns 500 ==> Internal Server Error..

    res.status(500).json({
        status: 'error',
        message: 'This route is not implemented yet 😔'
    });
};


// updateMe     ==>     updates the currently authenticated user..
exports.updateMe = (async (req, res, next) => {
    // This is the place we can update data but not "password"
    // "password" in authController
    
    // 1- If the user tries to update password or even the body of request contains "password" field ..
    if(req.body.password || req.body.confirmPasswor) {
        return next(new AppError('This route is not for password update. Please use "updatePassword"', 400));
    }


    
    // 2- If not, we simply update user document..

    // We won't take the whole body to update,
    // Because the user may set the role: 'admin' which is not allowed to anyone..
    // We actually will let him update the "name" or "mail" ..

    const filteredBody = filterObj(req.body, 'name', 'email');  // just keep "name" and "email" fields..

    const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
        new: true,
        runValidators: true
    });
    
    
    res.status(200).json({
        status: 'success',
        // send the updated user to the client 
        data: {
            user: user
        }
    })
})