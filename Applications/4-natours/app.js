const fs = require('fs');
const express = require('express');
const app = express();      // when calling the function express(), it adds a bunch of variables to app variable.


// A middleware function is the function that can modify the incoming request data.
// it's called so because it stands between the request and response ..
// and the middleware here is:
app.use(express.json());
// This line is very important to be able to recieve requests and convert them from "JSON" to "JS object"


// We have to save the data into a variable, but first, we have to parse it to JSON..

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
// So this variable will be automatically converted to a JSON Object..
// and ready to be sent back to the url '/api/v1/tours/'


// To start a server we will use "app.listen()" to listen to a port

// so, let's create a port variable
const port = 8080;

app.listen(port, () => {
    console.log(`App listening on port ${port}....`);
}); 

// What we need after is to define a "route"
// routing means to determine how the application responds to a certain client request.


// Whatever we want to do when someone request the root url, we need to call a callback function.
// specified as a second argument.
app.get('/', (req, res) => {
        
})



// Now we'll build the api for that application.. with url "/api/v1/tours"
// v1 .. is to be able to do some changes if we create a v2 to work for ..

app.get('/api/v1/tours', (req, res) => {
    // We want to send back all the tours 
    // that will send all the data about the resourse which is (tours)
    
    // We'll send to the client the data stored in "data" folder which are "JSON" files.

    res.status(200).json({
        'status': 'success',
        results: tours.length,      // to get an indication about how many tour object in tours object we have...
        data: {
            tours: tours
        }       // Note taht that is also ok as the "key" Cannot be a variable, it's just a string
                // but the value can be a variable.

        
    });
})


// Now, let's create a post request for adding a new tour
// Actually, it's the same url for getting tours, the only change is the http method..

app.post('/api/v1/tours', (req, res) => {
    console.log(req.body);

    // We will set the id of the created object with the id of the last object and +1
    // This issure is automatically done with the database,
    // but as we don't have any database yet, we have to set it manually..
    
    const newId = tours[tours.length-1].id + 1;
    console.log(newId);
    // Create a new tour..

    console.log("❌❌❌❌");
    console.log(req.body);
    const newTour = Object.assign({id: newId}, req.body);
    console.log(newTour);
    // Object.assign  ==> allows us to create a new object by merging two existing objects. 

    console.log(tours.length);
    // Now, we can push the new created object to our array of objects (tours)
    tours.push(newTour);
    console.log(tours.length);
    
    // not writeFileSync() because we're in the callback function
    
    // in writeFile() method, We have to convert the JS object into a JSON
    // using JSON.stringfy()
    fs.writeFile(`${__dirname}/dev-data/data/tours-test.json`, JSON.stringify(tours), (err) => {
        // 201 status code refers to "Created".
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })
})





// Now, we want to implement a route for specific tour using its id.
// This can be done by implementing a route that can accept a variable..

app.get('/api/v1/tours/:id', (req, res) => {    // the column here means that id is a variable. 
    
    

    console.log(req.params);    // This will show all vairables that are stored in the URL.. {id: xxx}
    // And they all are available for us to use in (req.params).
    
    // We can also set "optional parameters"
    // By using "?" after the variable..
    
    
    // Note that it always results a 200 Ok status code.. even if the id is not in the array tours.

    // We can check for the id before searching in the array, if it's larger than to the size of the array 
    // So, we have to return a 404 NOT FOUND status code ..

    if(req.params.id > tours.length) {
        return res.status(404).send('❌❌❌');     // that will exit this function and set the status code to 404.
    }
    
    // To find the object with id = id in the url
    // We can use .find() function to make it easier..
    
    // A nice trick to convert a value from req which is "String" into a number is to * numtiply by 1
    const num = req.params.id * 1;
    
    
    console.log(typeof(req.params.id));     // String
    console.log(typeof(tours[0].id));       // number
    
    
    const tour = tours.find(el => el.id === num);

    // Another way to check for the id :
    if(!tour) {
        return res.status(404).send('❌❌❌'); 
    }
    
    res.send(tour);


}) 







/////// Now, let's go to section (update) some tour details.....
// is's done by "patch" method..


// Pleaseeeeeeeeee, don't forget the / before the first route paramter. 
app.patch('/api/v1/tours/:id', (req, res) => {
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
})








// DELETING tours....
app.delete('/api/v1/tours/:id', (req, res) => {
    if(req.params.id > tours.length) {
        return res.status(404).json({
            'status': 'NOT FOUND',
            'message': 'Invalid ID...' 
        });
    }



    // note: 204 stands No-Content...
    res.status(204).json({
        status: 'success',
        // Also, when we deleted, we don't send any data back,,, so the data is null.
        data: null
    })
})