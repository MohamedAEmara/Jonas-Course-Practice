
class APIFeatures {
    // In this class we'll compine all features in one class
    // Just create an object out of this class and you'll be able to use all its features...
  
    // query        ==>   this the result we'll apply filter, sort, ... on it.
    // queryString  ==>   this is route containing all the filter, sort, and so on.
    constructor(query, queryString) {  
      // The query from "mongoose" , queryString from express (from the route)
      // We passed the query here to make it reusable as possible and not bound by a specific one.
      this.query = query;
      this.queryString = queryString;        
      console.log('From API');          // Just a hint for myself...          
    }
  
  
    // filter     ===>  filter the results with a {key:value} pair, that satisfy the condition in filter..
    filter() {
      const queryObj = { ...this.queryString };
      const execludedFields = ['page', 'sort', 'limit', 'fields'];
      execludedFields.forEach(el => delete queryObj[el]);
  
      // Advanced Filtering...
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  
      this.query = this.query.find(JSON.parse(queryStr));
  
  
      // to be able to chain more methods after, we have to return an object to be chained...
      return this;
    }
  
  
    // sort     ===>  sort the filtered result based on one or more factors...
    sort() {
      if(this.queryString.sort) {
        // console.log(req.query.sort);  
        // console.log(modifiedQuery.sort(req.query.sort));
        // query = query.sort(req.query.sort);
  
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort('-createdAt');
      }
  
      return this;
    }
  
  
    // limitFields    ===>    just show specific fields of the results we're interested in...
    limitFields() {
      if(this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);  
      } else {
        this.query = this.query.select('-__v');
      }
  
      return this;
    }
  
  
    // split the result into pages and choose one of them to display.. 
    paginate() {
      const page = this.queryString.page * 1 || 1;     // if the page query is present
      // Convert it to Number
      // Otherwise set the default value = 1
  
      const limit = this.queryString.limit * 1 || 100;
      const skip = limit * (page-1);
  
  
      
      // We have a built-in function that accepts a (skip) ===> pages to skip
      // and (limit) ===> pages to display
  
      this.query = this.query.skip(skip).limit(limit);
  
  
      return this;
    }
}
  
  


module.exports = APIFeatures;