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

    await Tour.findByIdAndUpdate(tourId, {
        ratingQuantity: stats[0].nRating,
        ratingAverage: stats[0].avgRating
    });

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










const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;