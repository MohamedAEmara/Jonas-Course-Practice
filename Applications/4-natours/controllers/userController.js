// const fs = require('fs');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');


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
