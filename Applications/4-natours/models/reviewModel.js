// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // });

  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});











reviewSchema.statics.calculateAverageRatings = async function(tourId) {
    
    // This refers to the current model.
    const stats = await this.aggregate([
        // We will pass all the stages we want 
        // 1- Select all reviews that belong to the current tour (that is passed as an argument)
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                // in "_id", we specify all the document that are in common.
                _id: '$',
                nRating: { $sum: 1 },       // Add 1 for every matching id document
                avgRating: { $avg: '$rating' }
            }
        }
    ]);


    // Now, the tours collection knows nothing about this aggregation and the values I've just calculated.
    // We'll update the (tours) collection with new ratings values...
    // All new values are stored in (stats). Actually stats is an array.

    if(stats.length > 0) {      // To make sure we at least have a review on this tour. To avoid reading "undefined"
        await Tour.findByIdAndUpdate(tourId, {
            ratingQuantity: stats[0].nRating,
            ratingAverage: stats[0].avgRating
        });
    }

    console.log(stats);
}
// We want  to call this function each time a new review is created to update the (number of ratings) & (rating average)...
// We'll use a "middleware" to do so.

// NOTE: it's a (post) middleware not pre to be able to see the tourId in $match:
reviewSchema.pre('save', function() {
    // This here points to the current review.
    
    // Review.calculateAverageRatings(this.tour);      // Because (this) points to the current review. we here passed the tourId of this review.
    // Because Reviews is not declared yet..........
    
    // We can use the (this.constructor) which points to the model who created that document (this) 
    // which is equivalent to (Review)...
    this.constructor.calculateAverageRatings(this.tour);

    // next();          // Post middleware has no access to "next"...
})









// =========================================== Delete & Update ================================================= //
// Now, we want to update nRating & avgRating whenever a user deletes or updates a review.

// This is when the user use any of the:
/*
    findByIdAndUpdate
    findByIdAndDelete
*/

// We'll use a pre middleware for that..  for all queries starts with (findOneAnd....) 
// NOTE: findByIdAndUpdate is a short and contains internally (findOneAnd...)

reviewSchema.pre(/^findOneAnd/, async function(next) {
    const rev = await this.findOne();
    // To be able to see and manipulate the document itself.
    console.log(rev);
    

    // We'll pass the (rev) to the next middleware by adding it to (this)
    this.rev = await this.findOne(); 
    console.log(this.rev);

    // NOTE: here we cannot use (post). Becuase in that case, we'll have no access to rev as the document will be delted or edited.

    next();
});


reviewSchema.post(/^findOneAnd/, async function() {
    // await this.findOne()         ===>  DOES NOT work because the query is already executed..

    // Here we want to have access to (rev) we just created...
    // A nice trick to do so is to add it to (this)
    await this.rev.calculateAverageRatings(this.rev.tour); 
    // Cool, we now have access to this.rev and it contains all data about the review...
    // So, we can pass the tour to get the average...

    // Now, ratingAVG & numRating are updated automatically whenever we perform Create, Update, Delete operations on reveiws.
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;