/*jshint multistr: true, node: true, esversion: 6, undef: true, unused: true, varstmt: true*/
"use strict";

// Internal Modules
const lib                     = require('../lib'),
      logger                  = require('../lib/logger');

module.exports = function(app) {

  /*
    GET: /products
    - Fetch product list
    - Response is array with HTTP status code 200.
    - Sample Request
      curl -X GET 'https://localhost:4000/product'
    - Sample Success Response
      ['BTC-BAT', 'ETH-OMG', 'ETH-NEO', .....]
    - Sample Failure Response
      []
  */
  app.get('/products', async (req, res, next) => {

    console.log(`GET: /products`);

    let result;

    try {
      result                  = await lib.getProducts();
    }
    catch (err) {
      err                     = `Error occurred while fetching products. Error: ${err}`;
      logger.error(err);
      result                  = [];
    }
    finally {
      res.status(200).send(result);
    }

  });

  /*
    GET: /products/:product/prices
    - Fetch product price list
    - Request contain input `product`
    - Response is array with HTTP status code 200.
    - Sample Request
      curl -X GET 'https://localhost:4000/product/BTC-BAT/prices'
    - Sample Success Response
      [{"exchange":"BNB","price":0.00002724,"high":0.0000284,"low":0.00002595,"bid":0.00002722,"ask":0.00002724,"volume":12576444},
       {"exchange":"BTX","price":0.00002733,"high":0.00002822,"low":0.00002601,"bid":0.00002712,"ask":0.00002733,"volume":1991622.02271444},
       {"exchange":"BFX","price":0.00002704,"bid":0.00002698,"ask":0.00002733,"high":0.00002846,"low":0.00002596,"volume":18392.39857079}]
    - Sample Failure Response
      []
  */
  app.get('/products/:product/prices', async (req, res, next) => {
    const { product }         = req.params;

    console.log(`GET: /product/${product}/prices`);

    let result;

    try {
      if (product)
        result                = await lib.getPrices(product);
      else
        result                = [];
    }
    catch (err) {
      err                     = `Error occurred while fetching price for ${product}. Error: ${err}`;
      logger.error(err);
      result                  = [];
    }
    finally {
      res.status(200).send(result);
    }
  });

};
