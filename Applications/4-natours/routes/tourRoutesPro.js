const express = require('express');
const router = express.Router();

const tourControllerPro = require('./../controllers/tourControllerPro');  

router
    .route('/')
    .post(tourControllerPro.createTour);              
    
// router 
//     .route('/:id')
//     .get(tourController.getTour)
//     .patch(tourController.updateTour)`````````````````                                                                                                                                                                                                                                                                                                                                                                                                       ```````````````````````````````````````````````````````````````````````````````````                                                                                                                                                                                                     
//     .delete(tourController.deleteTour);


module.exports = router;