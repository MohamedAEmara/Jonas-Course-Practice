const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('./../models/tourModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1- Get the currently booked tour..
    const tour = await Tour.findById(req.params.tourId);


    // 2- Create checkout session..
    const session = await stripe.checkout.sessions.create({
        // There are 3 options that are required here..
        payment_method_types: ['card'],
        // It's not safe to expose (success URL) to users, as some user may book a tour without purchasing...
        // But it's a tmp solution so far. 
        success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                name: `${tour.name} Tour`,
                description: tour.summary,
                images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
                amount: tour.price * 100,
                currency: 'usd',
                quantity: 1
            }
        ]
    })

    // 3- Send session as response..
    res.status(200).json({
        status: 'success',
        session
    })
});



exports.createBookingCheckout = catchAsync(async (req, res, next) => {
    const { tour, user, price } = req.query;
    // We now need to create a booking if all of these are specified...
    if(!tour || !user || !price)
        return next();

    await Booking.create({
        tour,
        user,
        price
    });

    res.redirect(req.originalUrl.split('?')[0]);        // To get the root (home page)
});