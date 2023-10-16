const express = require('express');
const fs = require('fs');
const router = express.Router();


// Another way to import modules from Controllers modules is to name all functions to include..
const {getAllUsers, getUser, createUser, deleteUser, updateUser, updateMe} = require('./../controllers/userController');
const authController = require('../controllers/authController');
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


router.post('/forgotPassword', authController.forgotPassword);
router.patch ('/resetPassword/:token', authController.resetPassword);

router.patch('/updatePassword', authController.protect, authController.updatePassword); 
// We used ".protect" because we want only logged in users can access this route..
// And to updatePassword, your first have to attach the "token" in Authorization after "Bearer" 


router.patch('/updateMe', authController.protect, updateMe);

// route For signning up new users..
router.post('/signup', authController.signup);
// We implemented it without .route() because there's nothing to compine in one single


router.get('/login', authController.login);

router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = router;

