/*jshint multistr: true, node: true, esversion: 6, undef: true, unused: true, varstmt: true*/
"use strict";

// NPM Module
const _                     = require('lodash'),
      REQUEST               = require('request'),
      SHOULD                = require('should');


describe('ROUTER INDEX', () => {

    it('Should check API GET: /products', done => {


        let reqOps = {
            url:            `http://localhost:4001/products`,
            method:         `GET`
        };

        REQUEST( reqOps, (err, res) => {
            // Since request is not from any white-listed server thus CORS wont allow it.
            SHOULD( _.get( res, ['statusCode'], 400) ).be.equal(500);
            done();
        });
    });

    it('Should check API GET: /products/BTC-BAT/prices', done => {

        let reqOps = {
            url:            `http://localhost:4001/products/BTC-BAT/prices`,
            method:         `GET`
        };

        REQUEST( reqOps, (err, res) => {
            // Since request is not from any white-listed server thus CORS wont allow it.
            SHOULD( _.get( res, ['statusCode'], 400) ).be.equal(500);
            done();
        });

    });

});