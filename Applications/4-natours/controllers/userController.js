// const fs = require('fs');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const sharp = require('sharp');         // For resizing images...
const multer = require('multer');

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users');   // call the callback function with error fields = (null)
//     },
//     filename: (req, file, cb) => {
//         // The file name in the destination will be called..
//         // user-id-timestamb.extenstion...
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-Date.now().${ext}`);      

//     }
// })


const multerStorage = multer.memoryStorage();       // Now, the image will be stored as (buffer)
// and to access the file (req.file.buffer)

const multerFilter = (req, file, cb) => {
    // This function is to test if the uploaded file is an image...
    
    // NOTE: any image type not matter it's jpg, png, ... 
    //      it always starts with (imgage/) in (mimetype) field..
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image, please upload only image', 400), false);
    }
}


const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})



exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = (req, res, next) => {
    if (!req.file) {
        return next();
    }
    
    // Save the filename with unique id.. & save it in the (req.file)
    req.file.filename = `user-${req.user.id}-Date.now().jpeg`;

    // To use sharp() we changed the multer settings to use (memoryStorage) instead of (diskStorage)..
    sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/img/users/${req.file.filename}`); 

}

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
    console.log(req.file);
    // prints all the information about the file uploaded.

    // NOTE: files are in (req.file) not (req.body)
    console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=');
    console.log(req.body);
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

    // Check if there's a photo fields...
    if (req.file) 
        filteredBody.photo = req.file.filename;

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


exports.deleteMe = catchAsync( async(req, res, next) => {
    // the logged-in user stored in req from the preivous middleware "protect"
    await User.findByIdAndUpdate(req.user._id, {active: false});

    res.status(204).json({      // 204 ==> for deleted.
        status: 'success',
        data: null
    });
})