// It's a best practice to keep the files that are related to "EXPRESS" in one file
// and every thing related to "the server" in another main file


// server.js   is where every thing starts..


const app = require('./app');

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port} ...`);
})

// NOTE:: to run "server.js" as our main entry file
// we have to change it from the configuration file (package.json)
// and make ==> "main": "server.js"
// and add a script ==> "start": "nodemon server.js"

// So, when I hit "$ npm start" ==> it will automatically execute the code
// for "$ nodemon server.js"