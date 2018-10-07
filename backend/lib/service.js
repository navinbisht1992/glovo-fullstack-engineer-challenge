/*jshint multistr: true, node: true, esversion: 6, undef: true, unused: true, varstmt: true*/
"use strict";

// NPM Module
const CRON                          = require('cron').CronJob,
      REQUEST                       = require('request'),
// Internal Module
      logger                        = require('./logger');

// Product Object
let Product                         = require('../config/product');

const reqOps = {
    method:                         "GET",
    headers: {
        "Authorization":            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRldkBnbG92b2FwcC5jb20iLCJpZCI6IjVhNTcyZGEyNTM4OWMzNzZiZWZlNjY1NCIsImlhdCI6MTUxNTY2MjgyMn0.a6homMOumqLBxwfX9nOwbBaxmSx-srkS8dISSPCPPYE"
    }
};

/*
  hitHttpApi
  - Make API call
  - Parse Response and return array
  - Input is JSON object with required key url, method
*/
function hitHttpApi (reqOps) {

    return new Promise ( (resolve, reject) => {
    
        // Make api call using request.js
        REQUEST(reqOps, (err, res, body) => {

            let message             = `Requested with: ${JSON.stringify(reqOps)}`;
            logger.info(message);

            if(err || (res && res.statusCode !== 200) ) {
                let error           = `Error in response: ${ typeof (err || body) === 'object' ? JSON.stringify(err || body) : (err || body) }`;
                logger.error(error);
                return resolve([]);
            }

            try {
                if(typeof body === 'string') {
                    body = JSON.parse(body);
                }

                let success         = `Success response status code: ${res.statusCode}`;
                logger.info(success);
                return resolve(body);
            }
            catch (err) {
                err                 = `Invalid Response: ${body}`;
                logger.error(err);
                return resolve([]);
            }
        });
    });
}

/*
  setProducts
  - use hitHttpApi to make api call to fetch products from all three exchanges (BNB, BTX, BFX)
  - Fetch common products
  - Update products list in object Product
*/
async function setProducts () {

    try {

        let multipleRequest         = [];

        for (let exchange of Product.exchanges) {
            reqOps.url              = `https://api.moneeda.com/api/exchanges/${exchange.toUpperCase()}/products`;

            multipleRequest.push( hitHttpApi(reqOps) );
        }

        let result                  = await Promise.all(multipleRequest);
        
        // Since Exchange are only three thus not using array or hash map, to find common products
        // Number of products from each exchange
        let l1                      = result[0].length,
            l2                      = result[1].length,
            l3                      = result[2].length;

        // Products of each exchange
        let arr1, arr2, arr3;

        // Following logic is to find Exchange with minimum products.
        // If third Exchange have minimum products
        if ( l3 <= l2 && l3 <= l1 ) {
            arr1                    = result[2];

            // If second Exchange have lesser products than first
            if ( l2 < l1 ) {
                arr2                = result[1];
                arr3                = result[0];
            }
            // If first Exchange have lesser products than second
            else {
                arr2                = result[0];
                arr3                = result[1];
            }

        }
        // If second Exchange have minimum products
        else if ( l2 <= l1 && l2 < l3) {
            arr1                    = result[1];

            // If first Exchange have lesser products than third
            if ( l1 < l3 ) {
                arr2                = result[0];
                arr3                = result[2];
            }
            // If third Exchange have lesser products than first
            else {
                arr2                = result[2];
                arr3                = result[0];
            }
        }
        // If first Exchange have minimum products
        else {
            arr1                    = result[0];

            // If second Exchange have lesser products than third
            if ( l2 < l3 ) {
                arr2                = result[1];
                arr3                = result[2];
            }
            // If third Exchange have lesser products than second
            else {
                arr2                = result[2];
                arr3                = result[1];
            }
        }

        // Number of products in each exchange, l1 <= l2 <= l3
        l1                          = arr1.length;
        l2                          = arr2.length;
        l3                          = arr3.length;

        let tempProducts            = [],  // Common products in arr1 and arr2
            products                = [];  // Common products in all 3, tempProducts (arr1 and arr2) and arr3
        
        /*
         Could had used any in-build JavaScript loop for-in or for-of or other array functions Array.prototype.filter etc.,
         these all are linear and thus complexity would be O(l1*l2), as array are big,
         thus modified complexity to O( (l1/2) * (l2/2) ) or O(l1*l2/4) for even l1 and l2
         Taking 2 smallest Exchange products for comparison to minimize time
        */
        for ( let i = 0, j = (l1 - 1); i <= j; i++ ) {

            // Complexity of this loop is O(l2/2) if l2 is even or O( (l2/2) + 1) if l2 is odd
            for ( let m = 0, n = (l2-1); m <= n; m++ ) {

                if ( arr1[i].id === arr2[m].id ) {
                    tempProducts.push( arr2[m] );
                }
                else if ( arr1[i].id === arr2[n].id ) {
                    tempProducts.push( arr2[n] );
                }
                else if ( arr1[j].id === arr2[m].id ) {
                    tempProducts.push( arr2[m] );
                }
                else if ( arr1[j].id === arr2[n].id ) {
                    tempProducts.push( arr2[n] );
                }

                --n;
            }

            --j;
        }

        /**
         * Since only common of products of all 3 Exchanges is required, thus using products of 2 Exchange to search in third one
         * E1 = [A,B,C,D]  E2 = [A,B,D]
         * new Ex = [A,B,D]
         * Will now compare E3 = [A,D] with Ex
        */
        l1                          = tempProducts.length;

        for ( let i = 0, j = (l1 - 1); i <= j; i++ ) {

            // Complexity of this loop is O(l2/2) if l2 is even or O( (l2/2) + 1) if l2 is odd
            for ( let m = 0, n = (l2-1); m <= n; m++ ) {

                if ( tempProducts[i].id === arr3[m].id ) {
                    products.push( arr3[m].id.toUpperCase() );
                }
                else if ( tempProducts[i].id === arr3[n].id ) {
                    products.push( arr3[n].id.toUpperCase() );
                }
                else if ( tempProducts[j].id === arr3[m].id ) {
                    products.push( arr3[m].id.toUpperCase() );
                }
                else if ( tempProducts[j].id === arr3[n].id ) {
                    products.push( arr3[n].id.toUpperCase() );
                }

                --n;
            }

            --j;
        }
        
        // Empty product list before inserting new. Just for safe side.
        Product.products            = [];
        Product.products            = products.slice();

        return Product.products;
    }
    catch(err) {
        err                         = `Unable to update products list. Error: ${err}`;
        logger.error(err);
        Product.products            = [];
        throw "Error";
    }
}

/*
  getPrices
  - use hitHttpApi to make api call to fetch prices of input product from all three exchanges (BNB, BTX, BFX)
  - Return array with list of all prices
  - Input is string and represents Product Id
*/
async function getPrices (input) {

    try {

        input                       = input.toString().toUpperCase();

        let multipleRequest         = [];

        let exchanges               = Product.exchanges,
            l                       = exchanges.length;

        for (let i = 0; i < l; i++) {
            reqOps.url              = `https://api.moneeda.com/api/exchanges/${exchanges[i].toUpperCase()}/ticker?product=${input}`;

            multipleRequest.push( hitHttpApi(reqOps) );
        }

        let result                  = await Promise.all(multipleRequest);

        let newPrices               = [];

        for (let i = 0; i < l; i++) {
            newPrices.push( Object.assign( {"exchange": exchanges[i]}, result[i] ) );
        }

        return newPrices;

    }
    catch(err) {
        err                         = `Unable to fetch product prices for ${input}. Error: ${err}`;
        logger.error(err);
        throw "Error";
    }
}

/*
  setSearchFrequency
  - Set new product in Product.products into array Product.searchFrequency, with default value 0
  - No input, no output
*/
function setSearchFrequency () {
    for(let product of Product.products) {
        if( !(product in Product.searchFrequency) ) {
            Product.searchFrequency[product] = 0;
        }
    }
}

/*
 setLastFiveSearch
 - set details of last five searched product into Product.lastFiveSearch
 - 2 inputs, product id and its price list of 3 exchanges
*/
function setLastFiveSearch (input, newPrices) {

    /*
      Since only maintaining last 5 searched product,
      check
        if input is new 
            If cashe is not full, insert new one.
            If cache is full, delete oldest one insert new
        If input is in our cahe
            replace old prices with new one
    */

    let isNew                       = true,
        location                    = -1,
        cacheSize                   = Product.lastFiveSearch.length;

    // Find if new search or old
    for(let i = 0; i < cacheSize; i++) {
        if ( input === Product.lastFiveSearch[i].id ) {
            isNew                   = false;
            location                = i;
            break;
        }
    }

    if (isNew) {
        if ( cacheSize < 5 ) {
            Product.lastFiveSearch.push( Object.assign( { id: input }, { prices: newPrices } ) );
        } else {
            // Remove oldest search
            Product.lastFiveSearch.shift();
            // Add new search
            Product.lastFiveSearch.push( Object.assign( { id: input }, { prices: newPrices } ) );
        }
    } else {
        // Update prices for old entery
        Product.lastFiveSearch[location].prices = newPrices;
    }

}

/*
 setTopFiveSearch
 - set details of top five searched product into Product.topFiveSearch
 - Uses Product.searchFrequency to get top 5 searched product ID
 - Uses getPrices to fetch current prices for top 5 searched product ID
*/
async function setTopFiveSearch () {

    let arrF = [],     // Top five serch frequency
        arrV = [];     // Top five serch product id

    // Get all serch frequency
    for (let key in Product.searchFrequency) {
        arrF.push(Product.searchFrequency[key]);
    }

    // Sort search frequency, get top five
    arrF.sort( (a,b) => b-a);
    arrF.length > 5 ? arrF.length = 5 : '';

    // Get top five search product id
    for (let i of arrF) {
        // Get id of product with same frquency as of i
        for (let key in Product.searchFrequency) {
            // If product have frequency i and is not in arrV
            if ( Product.searchFrequency[key] === i && !arrV.includes(key) ) {
                arrV.push(key);
                break;
            }
        }
    }

    // Trim lower product id
    /*
      if arrF = [5,5,5,4,4]
      multiple product id have search frequency 4
      than keep first 2 and trim others
    */
    arrV.length > 5 ? arrV.length = 5 : '';

    let message                     = `Top 5 Searched product id: ${arrV}, frequency of search: ${arrF}`;
    logger.info(message);

    try {
        // Clear previous values for new one.
        Product.topFiveSearch       = [];

        // Fetch prices for top 5 searched product id
        for (let id of arrV) {
            let prices              = await getPrices(id);
            Product.topFiveSearch.push( Object.assign( {}, { id, prices } ) );
        }
    }
    catch (err) {}
}

/*
 updateSearchFrequency
 - update searched frequency of product in Product.searchFrequency
 - product ID is provided as input
*/
function updateSearchFrequency (input) {
    input in Product.searchFrequency ?
        Product.searchFrequency[input] += 1
        :
        Product.searchFrequency[input] = 0;
}

// Cron job to update products, at 16 Minute and 3 Second every Hour
new CRON('3 16 * * * *', async () => {

    logger.info(`Updating product list`);

    try {
        await setProducts();     // Fetch products
        setSearchFrequency();    // Update search frequency for new products
    }
    catch (err){}
}, null, true);

// Cron job to update top Five searched product prices, at 16 Second every Minute
new CRON('16 * * * * *', async () => {

    logger.info(`Updating prices for top 5 searched product`);

    try {
        await setTopFiveSearch();
    }
    catch (err){}
}, null, true);

// Cron job to update last 5 Searched product prices, at 18 Minute and 36 Second every Hour
new CRON('36 18 * * * *', async () => {

    logger.info(`Updating prices for last 5 searched product`);

    try {
        for(let product of Product.lastFiveSearch) {
            product.prices          = await getPrices(product.id);
        }
    }
    catch (err){}
}, null, true);

module.exports = {
    setProducts,
    getPrices,
    setLastFiveSearch,
    setSearchFrequency,
    updateSearchFrequency
};
