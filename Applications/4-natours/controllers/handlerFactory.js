const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require('../utils/apiFeatures');

// Here, we'll create a function that creates a function that looks as the following function (deleteTour)
// But, now only for a tour; but for every single model that we have in our project.

/*
    exports.deleteTour = catchAsync(async(req, res, next) => {
        const tour = await Tour.findByIdAndDelete(req.params.id);

        if(!tour) {
            return next(new AppError('No tour found with that ID'));
        }
        res.status(204).json({
            status: 'success',
            message: 'Tour deleted successfully'
        });
    })
*/

// Because we want to make it generic, we have to pass the model we want to create a function for.
// We'll call it for example: "deleteOne" and then customise it based on the model we want.

exports.deleteOne = (Model) => catchAsync(async(req, res, next) => {
    // "doc" not tour because we don't know yet the model we are using.
    const doc = await Model.findByIdAndDelete(req.params.id);

    if(!doc) {
        return next(new AppError('No document found with that ID'));
    }
    res.status(204).json({
        status: 'success',
        data: null
    });
})



exports.updateOne = Model => catchAsync(async(req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: doc
    });
})


// NOTE: here, we don't know if we have a populate after find or not
// So, we'll add it as a parameter and if it's present, apply it on the query.
exports.getOne = (Model, populateOptions) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if(populateOptions) {
        query = query.populate(populateOptions);
    }

    const doc = await query;

    if(!doc) {
        return next(new AppError('No doc found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: doc
    });
});




exports.getAll = (Model) => catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const doc = await features.query;

    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
            doc
        }
    });
});


// All we need here is to make the (req.params.id =  req.user.id)
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next(); 
}
// Now, what I need is to add this middleware before "getUser"