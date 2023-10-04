// Now, if we want to get the most 5 cheapest with the highest rating of all tours

// We can do it this way:

'127.0.0.1:3000/api/v1/tours?limit=5&sort=ratingAverage,price'


// We can make this easy to read for users..
// We'll implement a new route 
// for example
// router.route('/top-5-cheap').get(tourController.getAllTours)

// In order not to reimplement the logic in "getAllTours", we will use it as is..
// But first, we will call a middle ware function that do the job for filtering these 5 top best

// For example (aliasTopTours)


 

