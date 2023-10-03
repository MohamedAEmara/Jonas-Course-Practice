const express = require('express');
const router = express.Router();

const tourControllerPro = require('./../controllers/tourControllerPro');  

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