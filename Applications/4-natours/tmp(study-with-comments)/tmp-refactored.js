const fs = require('fs');
const express = require('express');
const { getuid } = require('process');
const app = express();      // when calling the function express(), it adds a bunch of variables to app variable.


// A middleware function is the function that can modify the incoming request data.
// it's called so because it stands between the request and response ..
// and the middleware here is:
app.use(express.json());
// This line is very important to be able to recieve requests and convert them from "JSON" to "JS object"


// We have to save the data into a variable, but first, we have to parse it to JSON..

const tours = JSON.parse(fs.readFileSync(`../${__dirname}/dev-data/data/tours-simple.json`));
// So this variable will be automatically converted to a JSON Object..
// and ready to be sent back to the url '/api/v1/tours/'



const users = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/users.json`));

// To start a server we will use "app.listen()" to listen to a port

// so, let's create a port variable
const port = 8080;

app.listen(port, () => {
    console.log(`App listening on port ${port}....`);
}); 


const getAllTours = (req, res) => {
    res.status(200).json({
        'status': 'success',
        results: tours.length,      
        data: {
            tours: tours
        }      

        
    });
};

const createTour = (req, res) => {
    const newId = tours[tours.length-1].id + 1;
    console.log(newId);

    console.log("❌❌❌❌");
    console.log(req.body);
    const newTour = Object.assign({id: newId}, req.body);
    console.log(newTour);
``
    console.log(tours.length);
    tours.push(newTour);
    console.log(tours.length);

    fs.writeFile(`${__dirname}/dev-data/data/tours-test.json`, JSON.stringify(tours), (err) => {
        // 201 status code refers to "Created".
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })
}

const getTour = (req, res) => {    // the column here means that id is a variable. 
    if(req.params.id > tours.length) {
        return res.status(404).send('❌❌❌');     // that will exit this function and set the status code to 404.
    }
    
    const num = req.params.id * 1;
    
    const tour = tours.find(el => el.id === num);
    // Another way to check for the id :
    if(!tour) {
        return res.status(404).send('❌❌❌'); 
    }
    res.send(tour);
}

const deleteTour = (req, res) => {
    if(req.params.id > tours.length) {
        return res.status(404).json({
            'status': 'NOT FOUND',
            'message': 'Invalid ID...' 
        });
    }

    res.status(204).json({
        status: 'success',
        // Also, when we deleted, we don't send any data back,,, so the data is null.
        data: null
    })
};

const updateTour = (req, res) => {
    // We'll also check first for the id before processing any response...
    if(req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'NOT FOUND 😔',
            message: 'Invalid ID...'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated Tour here NOT IMPLEMENTED YET...>'
        }
    })
};


const getAllUsers = (req, res) => {
    // NOT IMPLEMENTED YETTTTTTTT...
    // just returns 500 ==> Internal Server Error..

    res.status(500).json({
        status: 'error',
        message: 'This route is not implemented yet 😔'
    });
};

const createUser = (req, res) => {
    // NOT IMPLEMENTED YETTTTTTTT...
    // just returns 500 ==> Internal Server Error..

    res.status(500).json({
        status: 'error',
        message: 'This route is not implemented yet 😔'
    });
};


const getUser = (req, res) => {
    // NOT IMPLEMENTED YETTTTTTTT...
    // just returns 500 ==> Internal Server Error..

    res.status(500).json({
        status: 'error',
        message: 'This route is not implemented yet 😔'
    });
};

const updateUser = (req, res) => {
    // NOT IMPLEMENTED YETTTTTTTT...
    // just returns 500 ==> Internal Server Error..

    res.status(500).json({
        status: 'error',
        message: 'This route is not implemented yet 😔'
    });
};

const deleteUser = (req, res) => {
    // NOT IMPLEMENTED YETTTTTTTT...
    // just returns 500 ==> Internal Server Error..

    res.status(500).json({
        status: 'error',
        message: 'This route is not implemented yet 😔'
    });
};





/*
    app.get('/api/v1/tours', getAllTours);
    app.post('/api/v1/tours', createTour);
    app.get('/api/v1/tours/:id', getTour);
    app.patch('/api/v1/tours/:id', updateTour);
    app.delete('/api/v1/tours/:id', deleteTour);
*/

// Another way to call these routes is the following ....

/*
    app.route('/api/v1/tours').get(getAllTours);
    app.route('/api/v1/tours').post(createTour);
    app.route('/api/v1/tours/:id').get(getTour);
    app.route('/api/v1/tours/:id').patch(updateTour);
    app.route('/api/v1/tours/:id').delete(deleteTour);
*/

// An extremely better way is to chain more than one http method together...

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);




// -------------------------------------------------------------------------------------
// =====================================================================================
// -------------------------------------------------------------------------------------

// Now, let's move forward with another "RESOURCE" which is (user)

app
    .route('/api/v1/users')
    .get(getAllUsers)
    .post(createUser);


app
    .route('/api/v1/users/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);


// These functions are not implemented yet. So, I'll implement them after other functions..



// -------------------------------------------------------------------------------------
// =====================================================================================
// -------------------------------------------------------------------------------------

// in app.route()       ==>     app is our router
// but in order to organise our project.. we'll create a router for each resource..
// As Follows:



app.use('/api/v1/tours', tourRouter);   // so, we'll use this middleware "tourRouter"
                                        // for this specific route    "/api/v1/tours"

const tourRouter = express.Router(); 
// this "tourRouter" here is actually a "middleware" 


// So, For any route that uses tourRouter  ==>  the path will be relative to '/api/v1/tours/'

tourRouter 
    .route('/')         // Actually this '/' is relative to the tourRouter which is "/api/v1/tours"
    .get(getAllTours)
    .post(createTour);


tourRouter
    .route('/:id')      // And this is relative to the tourRouter which is '/api/v1/tours/:id'
    .get(getUser)
    .patch(updateTour)
    .delete(deleteTour);







// let's do the same thing with users   ==>     this called (mouting routers)

const userRouter = express.Router();

app.use('/api/v1/users', userRouter);


userRouter
    .route('/')
    .get(getAllUsers)
    .post(createUser);

userRouter
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);




// Now, we'll create separate folders

// for examples routes


// I'll keep this file as it.. as it contains many notes, and take some snippets from it to other modules...



// -------------------------------------------------------------------------------------
// =====================================================================================
// -------------------------------------------------------------------------------------




// Now, we'll learn how to chain multiple middleware functions for the same route..
// We may want to use it if we want to call a "middleware" function before calling the Controller..
