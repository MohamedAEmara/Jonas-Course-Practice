// In this module we'll get rid of all repetitive "Try & Catch"
// And combine them in a single "catchAsync" function..

const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
// We will move this function to a new module in "utils" ==> "catchAsync.js"
/*
const catchAsync = fn => {
    // Note that fn is an async function that returns a "Promise"
    // So, we can attach .catch() 
    
    // We return a function not a returned value from a function.
    
    console.log('nnnnnnnnnnnnoooooooooooooooooooo');
    return (req, res, next) => {
        fn(req, res, next).catch(err => next(err));
    }
}
*/


// We added a "next" here to be able to pass the error into the next middleware
exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    console.log('✅✅✅');
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    }); 
});




exports.getAllTours = getAll(Tour);




exports.getTour = factory.getOne(Tour, { path: review });   // path is the field that the population will be stored in



// exports.updateTour = catchAsync(async(req, res, next) => {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true
//     });

//     res.status(200).json({
//         status: 'success',
//         data: tour
//     });
// })

exports.updateTour = factory.updateOne(Tour);


// exports.deleteTour = catchAsync(async(req, res, next) => {
//     const tour = await Tour.findByIdAndDelete(req.params.id);

//     if(!tour) {
//         return next(new AppError('No tour found with that ID'));
//     }
//     res.status(204).json({
//         status: 'success',
//         message: 'Tour deleted successfully'
//     });
// })

// We'll use the function created from "handleFactory" module 

exports.deleteTour = factory.deleteOne(Tour);


exports.getTourStats = catchAsync(async(req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: {
                ratingAverage: {$gte: 4.5}
            } 
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                avgRating: { $avg: '$ratingAverage' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                avgPrice: { $avg: '$price' }
            }
        },
        {
            $sort: {
                avgPrice: 1
            }
        }
    ]);


    res.status(200).json({
        status: 'success',
        data: stats
    });
});



exports.getMonthlyPlan = catchAsync( async(req, res, next) => {
    const year = req.params.year * 1;
    
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: {
                    $month: '$startDates'
                },
                countTours: {
                    $sum: 1
                },
                tours: {
                    $push: '$name'
                }
            }
        },
        {
            $addFields: { 
                month: _id 
            }
        },
        {
            $sort: {
                month: 1
            }
        },
        {
            $project: {
                _id: 0
            }
        }
    ]);


    res.status(200).json({
        status: 'success',
        cnt: plan.length,
        data: plan
    });

});



exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';        // note: everything in query is a "string"
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    // Now, we're ready to send our reqest to the next function which is "getAllTours". 
    next(); 
}
  