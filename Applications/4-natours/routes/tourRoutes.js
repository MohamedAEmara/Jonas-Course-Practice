const express = require('express');
const fs = require('fs');
const router = express.Router();

const tourController = require('./../controllers/tourController');  
// This object contains all the functions in the module "tourController";
// To access any of these functions we'll use the object name before..


router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.createTour);


router 
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);


module.exports = router;