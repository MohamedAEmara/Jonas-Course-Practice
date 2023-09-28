const express = require('express');
const fs = require('fs');
const router = express.Router();

const tourController = require('./../controllers/tourController');  
// This object contains all the functions in the module "tourController";
// To access any of these functions we'll use the object name before..

router.param('id', tourController.checkID);     // another way for checking for the id
                                                // using the advantage of "middleware"



                                                
// Now, we'll learn how to chain multiple middleware functions for the same route..
// We may want to use it if we want to call a "middleware" function before calling the Controller..

// For example for check the data in "body" before sending back a response..

// Create a checkBody middleware
// The implementaion of the "checkBody" is in the "tourController" module

// We can access it using (tourController.checkBody)


router
    .route('/')
    .get(tourController.getAllTours)
    // .post(tourController.createTour);
    .post(tourController.checkBody, tourController.createTour);              
    // simply to add middleware just send the function of the middleware 
    // before the callback function and it will be executed first...

router 
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);


module.exports = router;