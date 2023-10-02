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

