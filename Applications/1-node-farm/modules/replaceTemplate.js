
const replaceTemplate = (temp, product) => {

    //   g          ===>    stand for global
    //   /{%%}/     ===>    placeholder with regular expression.

    let output = temp.replace(/{%PRODUTNAME%}/, product.productName);
    output = output.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%ID%}/g, product.id);


    if(!product.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/, 'not-organic');
    }


    // return the modified output to be able to use the modified file below in "map"
    return output;
}


module.exports = replaceTemplate;