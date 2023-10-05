// Here we will use the same approach we used in "tourController" but with databases, not files..
const Tour = require('../models/tourModel');


// Import the API Class (APIFeatures)
const APIFeatures = require(`${__dirname}/../utils/apiFeatures.js`);



// ================================ TOP 5 BEST TOURS ===================================== //


exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';        // note: everything in query is a "string"
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  // Now, we're ready to send our reqest to the next function which is "getAllTours". 
  next(); 
}


exports.createTour =  (req, res) => {

    console.log('from tourControllerPro ✅✅');
    // We can create a new tour this way..
    // const newTour = new Tour({});
    // newTour.save();

    
    // But a new way we can use is: 
    // Tour.create({});        // here we call the method directly on the Tour
    
    // but in the first version we call the method on the "newTour"
    
    // NOTE: both of ".save()" and ".create()" return a promise..

    // We can also use "Async Await" ==> but  to do so, we have to make this function "Async"
    // and store the returned value into a variable..
    

        // const newTour = new Tour({})
        // newTour.save()
        console.log('==========================================================');
        // console.log(req);
        console.log('==========================================================');
        // console.log(req.name);
        // console.log(req.body.name);
        // console.log(req.body);
        console.log('==========================================================');
        // const newTour = await Tour.create(req.body);
        // const newTour = Object.assign({}, JSON.parse(req.body));
        console.log('aaa ' + req.body);
        // console.log('bbb ' + res.body);
        const newTour = new Tour(req.body);
        console.log(newTour);

        newTour.save().then(() => {
            res.status(201).json({
                status: 'success',
                data: {
                  tour: newTour
                }
              });
        }).catch((err) => {
        res.status(400).json({
          status: 'fail',
          message: err
        })
      })


}

// ================================ Querying ======================================== //

// Now, we'll learn how to filter our database with some {key: value} pair filter...
// to filter in URL, we pass {key:value} pair after ? in our route..
// For example:

//    localhost:2000/api/v1/tours?duration=5&difficulty=easy

// Actually "Postman" recognises the parameters and puth the value with its key as a parameters.


// Now, we'll know how to handle these filters in Express..

// These data can be accessed by "req.query"
// ===================================================================================



exports.getAllTours = async (req, res) => {
    try {
        ///////////////////////////////////////// EXECUTE QUERY /////////////////////////////////////////////
        const features = new APIFeatures(Tour.find(), req.query)     
        // we pass query as (all documents) 
        // and queryString as (the query in the path)
        .filter()
        .sort()
        .limitFields()
        .paginate();
        // then, we applied all the fucntions in "APIFeatures class"
    
        // After that we have the qeury ready to display...
        const tours = await features.query;
        

    
        res.status(200).json({
        status: 'success',
        results: tours.length,
        tours: tours
        });
    } catch (err) {
        console.log("Error ❌❌");
        res.status(500).json({
            status: 'fail',
            error: err
        });
    }
}



exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1;
        
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'              // This "$unwind" separates all array elements into a single documents
            },   // for example if we have 3 start dates for "Alex" trip ,,, there will be 3 trips all with one of the start dates.
            
            {   // Now, in $match we'll select all start dates that are in the year (year)
                $match: 
                    { startDates:      
                        {       // Mongo is good at comparing dates..
                            $gte: new Date(`${year}-01-01`),
                            $lte: new Date(`${year}-12-31`) 
                        } 
                    }
            },
            {
                $group: {
                    // _id is to specify what we will use to group documents..
                    _id: {
                        $month: '$startDates',       // this will group by similar monthes in startDates
                    },
                    countTours: {
                        $sum: 1                 // How many tours on this month
                    },
                    tours:                     // Which tours are on this month ??
                    // We want to push them into an array to display them all in this month..
                    // We can do it using ($push) in mongo..
                    {
                        $push: '$name'
                    }
                    
                }
            }, 
            {
                $addFields: { month: '$_id' }       // add a field named "month" with value (_id)
            },
            {
                $sort: {
                    month: 1
                }
            },
            {
                $project: {
                    _id: 0                      // hide _id from the output..
                }
            }
        
        
        ]);


        res.status(200).json({
            status: 'success',
            cnt: plan.length,
            data: plan
        })

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.getTourStats = async (req, res) => {          // stats is a short for "Statistics"
    // Here we can get the min, max, average, ....
    // using MongoDB aggregate function
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingAverage: { $gte: 4.5 } }
            },
            {   // group as the name tells, is to group some document with the same feature value together..
                // for example: Group all "easy" trips together... after that we're able to apply things like: "average", "min", "max", ... 
                $group: {
                    _id: { $toUpper: '$difficulty'},           // We will group all (difficult) together and the same thing for (easy) and (midium)
                    // _id: '$difficulty',      

                    // Note, we use _id to (group by) the filterred fields...
                    // we for example can group by difficulty   ===>    _id: { $difficulty }
                    // or can also group by ratingAverage       ===>    _id: { $ratingAverage }
                    
                    // We can also show the difficulties in UPPERCASE: {'DIFFICULT', 'EASY', 'MIDIUM'}
                    // By using another operator: ($toUpper)
                    // _id: { $toUpper: '$difficulty'}

                    numTours: { $sum: 1},           // just add (1) at each document to get the total number of documents in this group.
                    numRatings: { $sum: '$ratingQuantity'},
                    avgRating: { $avg: '$ratingAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            // Another Object in our array is "sort" to sort the result documents..
            {
                $sort: {
                    // Here, we specify which field we want to sort by..
                    // We here have access to all fields defined up here in "$group"
                    avgPrice: 1             // 1 for ascending..            
                }
            }
        /*    {
                // We also can repeat STAGES..  
                // we will use another $match with _id in it..
                // But _id here refers to "difficulty" we specified up in "$group"..
                $match: { _id: { $ne: 'EASY'} }             // "$ne" ==> "not equal"..
                // So, we'll show all groups excluding "EASY"...
            }   */
        ]);


        res.status(200).json({
            status: 'success',
            data: {
                stats: stats
            }
        });
    } catch (err) {
        console.log('Error ❌'); 
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}



exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)      // "req.params.id" to find the id passed in the URL.
    // This is a built-in function that's equivalent to:
    // Tour.findOne({_id: req.params.id});
     
      .then((promise) => {
        res.status(200).json({
          status: 'success',
          tour: promise
        });
      });
  } catch(err) {
    console.log('Error ❌❌');
    res.status(500).json({
      status: 'fail',
      message: err
    });
  }
}


exports.updateTour = async (req, res) => {
  try {
    // First, query for the tour to be updated..
    // And then update it..
    
    // We actually can do it in one function with mongoose...
    // findByIdAndUpdate()
    // It takes two parameters, the first on is the id of the document
    // And the second on is the body of the document..
    
    // It can take more than two parameters..
    // for example , {new: true}  ==> to return the updated document..
    // runValidator: true ==> to rerun the validator when we update document and check it.. 
    let tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Now, let's send the newly updated document to the client..
    res.json({
      status: 'success',
      tour: tour
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error'
    });
  }
}



exports.deleteTour = async(req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id).then(() => {
      console.log(tour);
      console.log('Deleted');
      res.status(200).json({
        status: 'success',
        message: 'Document Deleted Successfully'
      });
    })
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: 'Cannot Delete This Document'
    });
  }
}






