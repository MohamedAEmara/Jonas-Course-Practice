const express = require('express');
const router = express.Router();

const tourControllerPro = require('./../controllers/tourControllerProMax');     // I changed the path to "tourControllerProMax" 
                                                                                // now, "tourControllerPro" is for study only.

const tourControllerUltra = require('./../controllers/tourControllerUltra');

const authController = require('./../controllers/authController');





router
    .route('/tour-stats')
    .get(tourControllerPro.getTourStats);
                                                                                




router
    .route('/monthly-plan/:year')
    .get(tourControllerUltra.getMonthlyPlan);


// Note '/top-5-tours' has to be before '/:id' route ..
// otherwise, express will take (top-5-tours) as a params.id which will catch an error.
router
    .route('/top-5-tours')
    .get(tourControllerUltra.aliasTopTours, tourControllerUltra.getAllTours);


router
    .route('/:id')
    .get(tourControllerUltra.getTour)
    .patch(tourControllerUltra.updateTour)
    .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourControllerUltra.deleteTour);




router
    .route('/')
    // .post(tourControllerPro.createTour)    
    .post(tourControllerUltra.createTour)
    .get(authController.protect, tourControllerUltra.getAllTours);      // Show all tours only if 
                                                                        // user is logged in..
                                                                        
    
    
    




    
// router 
//     .route('/:id')
//     .get(tourController.getTour)
//     .patch(tourController.updateTour)`````````````````                                                                                                                                                                                                                                                                                                                                                                                                       ```````````````````````````````````````````````````````````````````````````````````                                                                                                                                                                                                     
//     .delete(tourController.deleteTour);


module.exports = router;