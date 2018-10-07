/*jshint multistr: true, node: true, esversion: 6, undef: true, unused: true, varstmt: true*/
"use strict";

// Internal Module
const Product                       = require('../config/product'),
      logger                        = require('./logger'),
      service                       = require('./service');

module.exports = {
    /*
      getProducts:
      - Get common products.
    */
    getProducts: async () => {

        let { products }            = Product;

        // If products are fetched and stored in Product.products
        if (products && products.length) {
            return products;
        } else {
            try {
                // Fetch common products
                let result          = await service.setProducts();

                // Set search frequency for new products
                service.setSearchFrequency();
                return result;
            }
            catch (err) {
                err                 = `Unable to fetch products list. Error: ${err}`;
                logger.error(err);
                // If error occurred then return empty array
                return [];
            }
        }
    },

    /*
      getPrices:
      Fetch prices for input product id.
    */
    getPrices: async (input) => {

        input                       = input.toString().toUpperCase();

        // Look into top five search
        for (let product of Product.topFiveSearch) {

            // If found in top five search
            if(input === product.id) {

                // Update Search Frequency
                service.updateSearchFrequency(input);

                // Update last five search
                service.setLastFiveSearch(input, product.prices);

                return product.prices;
            }
        }

        // Look into last five search
        for (let product of Product.lastFiveSearch) {

            // If found in last five search
            if(input === product.id) {

                // Update Search Frequency
                service.updateSearchFrequency(input);

                return product.prices;
            }
        }

        try {
            // If not found in topFiveSearch and lastFiveSearch
            // Fetch via API
            let result              = await service.getPrices(input);

            // Update Search Frequency
            service.updateSearchFrequency(input);

            // Update last five search
            service.setLastFiveSearch(input, result);

            return result;
        }
        catch (err) {
            err                     = `Unable to fetch price for ${input}. Error: ${err}`;
            logger.error(err);
            // If error occurred then return empty array
            return [];
        }

    }
};