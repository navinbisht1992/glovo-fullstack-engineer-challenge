/*jshint multistr: true, node: true, esversion: 6, undef: true, unused: true, varstmt: true*/
"use strict";

// NPM Module
const _                     = require('lodash'),
      SHOULD                = require('should'),
// Internal Module
      LIB                   = require('../lib');


describe('LIB INDEX', () => {

    it('Should check getProducts', done => {

        LIB.getProducts()
        .then( result => {

            SHOULD(result).be.an.Array;

            done();
        })
        .catch ( err => {
            // LIB.getProducts never throw error
        });
    });

    it('Should check getPrices', done => {

        LIB.getPrices( 'BTC-XLM' )
        .then( result => {

            SHOULD(result).be.an.Array;
            SHOULD( result.length ).be.equal(3);
            SHOULD( _.get( result, [0, 'exchange'], '') ).be.equal('BNB');
            SHOULD( _.get( result, [1, 'exchange'], '') ).be.equal('BTX');
            SHOULD( _.get( result, [2, 'exchange'], '') ).be.equal('BFX');

            done();
        })
        .catch ( err => {
            // LIB.getPrices never throw error
        });

    });

});