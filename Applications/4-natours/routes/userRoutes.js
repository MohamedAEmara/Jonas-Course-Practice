const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();



// Another way to import modules from Controllers modules is to name all functions to include..
const {getAllUsers, getUser, createUser, deleteUser, updateUser, updateMe, deleteMe, uploadUserPhoto} = require('./../controllers/userController');
const authController = require('../controllers/authController');
const AppError = require('../utils/appError');
// Let's create a middleware that acesses the parameter id from our URL

router.param('id', (req, res, next, val) => {   // the new added parameter "val" here 
    console.log(`Tour Id: ${val}`);             // holds the value from "id" in the route.
    next();                                     // This will be called whenever the route of "User" contains "/:id"
})
// If I enter the same route but for tours  ==>  '/api/v1/tours/111' won't call this middleware...
// and also if I'm using the route for users but without 'id', this middleware function will be ignored..

// this middleware here looks like unimportant
// But we can use it in our Project to make our life easier...
// We repeat our selves every time we check for the id if it's valid or not
// We can make a middle ware that checks ID once before every function and export it.



// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> NOTE <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// The following 4 routes don't need to be authenticated. 
router.post('/signup', authController.signup);
// We implemented it without .route() because there's nothing to compine in one single
router.get('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch ('/resetPassword/:token', authController.resetPassword);




// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> BUT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// All following routes need to be authenticated So, instead of repeating the middleware
// authController.protect in every route
// We can use it before all of them here. And this works the same.
// app.use(authController.protect);

// Now we can remove all protect middleware from the following routes.

router.patch('/updatePassword', authController.updatePassword); 
// We used ".protect" because we want only logged in users can access this route..
// And to updatePassword, your first have to attach the "token" in Authorization after "Bearer" 

// GetMe    ==>     Gets all info about logged in user
// router.get('/me', userController.getMe, userController.getUser);
// Instead of passing my id, I used a middleware to pass the logged-in user-id as a params.


// upload.single() becauase we want to upload a single file.
router.patch('/updateMe', uploadUserPhoto, updateMe);


router.delete('/deleteMe', deleteMe);
// route For signning up new users..


router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

// We can also use the middleware "restricTo('admin')" for example for some routes like "GetAllUsers".
module.exports = router;

