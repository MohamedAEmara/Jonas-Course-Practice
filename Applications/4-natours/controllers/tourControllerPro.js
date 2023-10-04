// Here we will use the same approach we used in "tourController" but with databases, not files..
const Tour = require('../models/tourModel');

// Here, we don't need to implement CheckId or CheckBody methods, as mongoose module does this for us..


// Now, we'll implement CRUD operations on tours..



// Create

// exports.createTour = async (req, res) => {
//     try {
//         console.log(req.body);
//         // const newTour = await Tour.create(req.body);
//         // console.log(newTour);
//         // res.status(201).json({
//         //     status: 'success'
//         //     // data: newTour
//         // })

//     } catch(err) {
//         console.log(err);
//         res.status(500).json({
//             status: 'fail',
//             message: 'Internal Server Error'
//         })
//     }
// } 



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

exports.getAllToursSTUDY = async (req, res) => {
  try {
    console.log('hereeeeeeeeeeee' + req.query);     // the query passed in the URL
    const allTours = await Tour.find(req.query).then((tmp) => {
      
      res.json({
        "number of tours": tmp.length,
        data: tmp
      });
    
      console.log('🙋‍♂️🙋‍♂️🙋‍♂️');
    })
    
    // another way to apply filter using "MONGOOSE": 
    const tours = await Tour.find()
      .where('duration')
      .equals(5)
      .where('difficulty')
      .equals('easy');
    
    // We can also use "lte" or "gte" not only "equals"
    // We also can sort, show the first number of results and many other stuff
    // console.log(tours);  
  
  } catch(err) {
    res.status(500).json({
      status: 'fail',
      message: {
        error: 'Internal Server Error',
        data: err
      }
    });
  }
}




exports.getAllTours = async (req, res) => {
  try { 
    const queryObj = req.query;   // it's const as if change its value, we actually change 
                                  // the value of the query in req object.
    
    // But to create a new Object not just a reference to the original one is as follows:
    let newQueryObj = {...req.query};

    // Now, we want to execlude some of queries like "page", that are not related to our database filters.
    // We'll create an arry to include execluded fields from our query..

    const execludedFields = ['page', 'sort', 'limit', 'fields']; 
    // Because these are about limitation of results that we'll learn soon..

    // Now, we want to remove all these fields from our new query object
    execludedFields.forEach(el => delete newQueryObj[el]);   // at every element from the execluded 
                                                             // fileds, we will remove it from our newQueryObject
    



    // ========================================== Advanced Filtering =================================

    // Now, we'll study how to do more complex querying .. like "greater than or equal"

    // to use it in our code, it's something like this:

    // const filterObject = { difficulty: 'easy', duration: {$gte: 5} };

    // Note that to use any of {gte, gt, lt, lte} we have to put it in a new object {}


    // But in the URL it's like this:
    // '127.0.0.1:3000/api/v1/tours?duration[gte]=5&difficulty=easy'
    // When we print out the (req.query) for this URL request, we'll get:
    // `{ difficulty: 'easy', duration: { gte: 5} }`


    // Note the only difference between "MongoDB query" and "req.query"
    // is that in "req.query" there's no $ before the operators like (gte)
    // We have to implement that to be able to use the filter comming from the URL
    // into our mongoose code..

    // We will replace "gte" with "$gte" ... After stringifying the object.

    const queryStr = JSON.stringify(newQueryObj);

    // We now want to match any of the {gt, gte, lt, lte}, but we want the exact words, not as a substring of another word...
    // So, we'll specify \b before and after the regular expression..
    // Another flag is (g) as we want to replace all occurences not only the first one
    // We first specify all the (words) to replace ..
    // Then, a callback function that applies the change on these (words)

    const modifiedQuery = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    // console.log(modifiedQuery);
    // console.log(queryStr);


    // Now, we can use the modifiedQuery as a query filter in find() method
    // But first, we have to parse it to JSON ...

    const tours = await Tour.find(JSON.parse(modifiedQuery));

    res.status(200).json({
      status: 'success',
      cntTours: tours.length,
      tours: tours
    })
  
  } catch (err) {                                        
    console.log('ERRRRRROR....');
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
      details: err
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