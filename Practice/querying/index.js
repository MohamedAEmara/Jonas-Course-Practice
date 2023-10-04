// Now, we'll learn how to filter our database with some {key: value} pair filter...
// to filter in URL, we pass {key:value} pair after ? in our route..
// For example:

//    localhost:2000/api/v1/tours?duration=5&difficulty=easy

// Actually "Postman" recognises the parameters and puth the value with its key as a parameters.


// Now, we'll know how to handle these filters in Express..

// These data can be accessed by "req.query"

// And to apply that filter in the res 
// we can pass it to our Tour.find(<filter>) to get the matched results..







// another way tours apply filter: 
  const tours = await Tour.find()
  .where('duration')
  .equals(5)
  .where('difficulty')
  .equals('easy');
// Actually this code won't work here, as it's a part of a project with some dependencies..


    // We can also use "lte" or "gte" not only "equals"
    // We also can sort, show the first number of results and many other stuff
    // console.log(tours);  





const queryObj = req.query;   // it's const as if change its value, we actually change 
    // the value of the query in req object.

// But to create a new Object not just a reference to the original one is as follows:
const newQueryObj = {...req.query};

// Now, we want to execlude some of queries like "page", that are not related to our database filters.
// We'll create an arry to include execluded fields from our query..

const execludedFields = ['page', 'sort', 'limit', 'fields']; 
// Because these are about limitation of results that we'll learn soon..

// Now, we want to remove all these fields from our new query object
execludedFields.forEach(el => delete newQueryObj[el]);   // at every element from the execluded 
                               // fileds, we will remove it from our newQueryObject


const filteredTours = await Tour.find(newQueryObj);



// ========================================== Advanced Filtering =================================

// Now, we'll study how to do more complex querying .. like "greater than or equal"

// to use it in our code, it's something like this:

const filterObject = { difficulty: 'easy', duration: {$gte: 5} };

// Note that to use any of {gte, gt, lt, lte} we have to put it in a new object {}


// But in the URL it's like this:
'127.0.0.1:3000/api/v1/tours?duration[gte]=5&difficulty=easy'
// When we print out the (req.query) for this URL request, we'll get:
`{ difficulty: 'easy', duration: { gte: 5} }`


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


console.log(queryStr);
console.log(modifiedQuery);

// Now, we can use the query but as a JSON object not a string like this:

const query = Tour.find(JSON.parse(modifiedQuery));