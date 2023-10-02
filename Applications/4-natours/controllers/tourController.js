// Here we will put all handlers into controllers
// handlers are function that do CRUD operations...

const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkID = (req, res, next, val) => {
    
    if(req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    next();
};
// So, now I can remove it from every function that checks for id before responsing...
// ✅✅✅


// We'll use exports.function() before each function in order to export more than one function 
exports.getAllTours = (req, res) => {
    res.status(200).json({
        'status': 'success',
        results: tours.length,      
        data: {
            tours: tours
        }      
    });
};


exports.checkBody = (res, req, next) => {
    // Check if the body contains the "name" property and "price" property ??
    // if(!req.body.name || !req.body.price) {
    //     return res.status(404).json({
    //         'status': 'Invalid Request',
    //         'data': req.body.id
    //     });
    // } 
    next();
}

exports.createTour = (req, res) => {
    const newId = tours[tours.length-1].id + 1;
    console.log(newId);

    console.log("❌❌❌❌");
    console.log(req.body);
    const newTour = Object.assign({id: newId}, req.body);
    console.log('new tour')
    console.log(newTour);
    console.log('new tour')
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

exports.getTour = (req, res) => {    // the column here means that id is a variable. 

    const num = req.params.id * 1;
    
    const tour = tours.find(el => el.id === num);
    // Another way to check for the id :
    if(!tour) {
        return res.status(404).send('❌❌❌'); 
    }
    res.send(tour);
}

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        // Also, when we deleted, we don't send any data back,,, so the data is null.
        data: null
    })
};

exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated Tour here NOT IMPLEMENTED YET...>'
        }
    })
};

