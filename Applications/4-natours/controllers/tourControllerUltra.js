// In this module we'll get rid of all repetitive "Try & Catch"
// And combine them in a single "catchAsync" function..

const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');


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





exports.getAllTours = factory.getAll(Tour);




exports.getTour = factory.getOne(Tour, { path: 'review' });   // path is the field that the population will be stored in



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
  


// /tours-distance/233/center/-40,45/unit/mi
// router.route('/tours-within/:distance/center/:latlng/unit/:unit')
exports.getToursWithin = async (req, res, next) => {
    const { distance, latlong, unit } = req.params;
    const lat = latlong.split(',')[0];
    const lng = latlong.split(',')[1];

    if(!lat || !lng) {
        next(new AppError('Please provide latitude and longitude in the format lat,lng.', 400));
    }
    

    ////////////////////////// GEO-WITHIN ///////////////////////////
    // in our query we'll use a special operator called "getWithin"
    // that takes a center coordinates & a radius to get all locations that are within this area...

    // $centerSphere takes an array.. 
    //      1- array of two element [lng, lat]
    //      2- radius of the sphere...

    // ================= Important Unit Conversions ================= //
    // To convert the distance form "miles" to radius or "km" to radian:
    let radius;
    if(unit === 'mi') {
        radius = distance / 3963.2;
    } else {
        radius = distance / 6378.1;
    }


    const tours = await Tour.find({ startLocations: {$geoWithin: { $centerSphere: [[lng, lat], radius]}} });


    res.status(200).json({
        status: 'success',
        data: {
            data: tours
        }
    })
    console.log(distance, lat, lng, unit);
}




exports.getDistances = catchAsync(async(req, res, next) => {
    const { distance, latlong, unit } = req.params;
    const lat = latlong.split(',')[0];
    const lng = latlong.split(',')[1];

    if(!lat || !lng) {
        next(new AppError('Please provide latitude and longitude in the format lat,lng.', 400));
    }

    const multiplier = (unit === 'mi') ? 0.000621371 : 0.001;
    const distances = await Tour.aggregate(
        {
            $getNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1],        // *1 to convert to numbers.
                },
                distanceField: 'distance',
                distanceMultiplier: 0.001       // We specify a number to be multiplied by all distances.
            }
        },
        {
            $project: {
                // The names of the fields we want to keep.
                distance: 1,
                name: 1,

            }
        }
    );


    res.status(200).json({
        status: 'success',
        data: {
            data: distances 
        }
    })
    console.log(distance, lat, lng, unit);
})




const multerStorage = multer.memoryStorage();       // Now, the image will be stored as (buffer)
// and to access the file (req.file.buffer)

const multerFilter = (req, file, cb) => {
    // This function is to test if the uploaded file is an image...
    
    // NOTE: any image type not matter it's jpg, png, ... 
    //      it always starts with (imgage/) in (mimetype) field..
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image, please upload only image', 400), false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});


exports.uploadTourImages = upload.fields([
    // We can add just one (imageCover) & up to 3 image for one tour.
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
])

// NOTE: 
/*
    If we have just one field data to add images we can use this form:
    upload.array('images', 3);          // (images) is the field name & (3) is the maxCount..
*/

exports.resizeTourImages = (req, res, next) => {
    console.log(req.files);     // When you have multiple files, they'll be stored in (req.files) 
    
}