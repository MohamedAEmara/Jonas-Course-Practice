const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

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