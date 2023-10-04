// Pagination


'localhost:2000/api/v1/tours?page=2&limit=10'
// This means to display 10 results per page and show page 2
// in other words, show results from [11 - 20]

// So, we need to skip 10 resutls with limit 10 in order to get results [11 - 20]

const page = req.query.page * 1 || 1;     // if the page query is present
                                              // Convert it to Number
                                              // Otherwise set the default value = 1

const limit = req.query.limit * 1 || 100;
const skip = limit * (page-1);


// We finally need to handle if the page is more than number of pages..
if(req.query.page) {
    const numTours = await Tour.countDocuments();
    if(skip > numTours) {
    // console.log('this page does not exist');
    throw new Error('This page does not exist');
    // If throwing the error happends, it will immediately go to the catch block
    // so the query won't finish and nothing will be displayed to the user..
    }    
}
// We have a built-in function that accepts a (skip) ===> pages to skip
// and (limit) ===> pages to display

query = query.skip(skip).limit(limit);
