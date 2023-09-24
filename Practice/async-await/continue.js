const fs = require('fs');
const superagent = require('superagent');



const readFilePro = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if(err) {
                reject('I could not find that file 😔');
            }
            resolve(data);   
        });
    });
};


const appendFilePro = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.appendFile(file, data + '\n', err => {
            if(err) reject('Cannot Write to the file 😔');
            resolve('Write Successfully ✅');
        });
    })
}


const getDogPic = async () => {
    try {
        const data = await readFilePro(`${__dirname}/dog.txt`);
        console.log('Breed: ' + data);

        const res1Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        const res2Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        const res3Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);

        
        const all = await Promise.all([res1Pro, res2Pro, res3Pro]);
        // this will run all the tree promises at the same time and save the result values in these 3 variables.
        const imgs = all.map(el => el.body.message);
        console.log(all[0].body.message);
        console.log(imgs);
    } catch(err) {
        // console.log(err);
        throw (err);
    }


    // We also can return a value from an "async" functions...
    return 'Ready 🐶';


}



(async () => {
    try {
        console.log(`1: Get the dog pics!!`);

        const x = await getDogPic()
            .then((x) => {
                console.log(x);
            })
            .catch(err => {
                console.log('CANNOT READ THE FILE ❌');
            })
        console.log(`3: Done getting dog pics!!`);
    } catch(err) {
        console.log('ERROR 💥');
    }
})()