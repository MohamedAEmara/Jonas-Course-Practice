const express = require('express');
const fs = require('fs');
const router = express.Router();


// Another way to import modules from Controllers modules is to name all functions to include..
const {getAllUsers, getUser, createUser, deleteUser, updateUser} = require('./../controllers/userController');

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
