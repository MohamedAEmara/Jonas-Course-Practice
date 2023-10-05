const express = require('express');
const router = express.Router();

const tourControllerPro = require('./../controllers/tourControllerProMax');     // I changed the path to "tourControllerProMax" 
                                                                                // now, "tourControllerPro" is for study only.




router
    .route('/tour-stats')
    .get(tourControllerPro.getTourStats);
                                                                                




router
    .route('/monthly-plan/:year')
    .get(tourControllerPro.getMonthlyPlan);



    
router
    .route('/top-5-tours')
    .get(tourControllerPro.aliasTopTours, tourControllerPro.getAllTours);


router
    .route('/')
    .post(tourControllerPro.createTour)    
    .get(tourControllerPro.getAllTours)
    
    

router
    .route('/:id')
    .get(tourControllerPro.getTour)
    .patch(tourControllerPro.updateTour)
    .delete(tourControllerPro.deleteTour);



    
// router 
//     .route('/:id')
//     .get(tourController.getTour)
//     .patch(tourController.updateTour)`````````````````                                                                                                                                                                                                                                                                                                                                                                                                       ```````````````````````````````````````````````````````````````````````````````````                                                                                                                                                                                                     
//     .delete(tourController.deleteTour);


module.exports = router;