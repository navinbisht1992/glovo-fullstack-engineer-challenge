/*jshint multistr: true, node: true, esversion: 6, undef: true, unused: true, varstmt: true*/
"use strict";

// NPM Module
const _                     = require('lodash'),
      SHOULD                = require('should'),
// Internal Module
      PRODUCT               = require('../config/product'),
      SERVICE               = require('../lib/service');


describe('LIB SERVICE', () => {

    it('Should check setProducts', done => {

        SERVICE.setProducts()
        .then( result => {
            SERVICE.setSearchFrequency();

            SHOULD(result).be.an.Array;
            SHOULD(result).be.equal( _.get(PRODUCT, ['products'], []) );

            done();
        })
        .catch ( err => {
            SHOULD(err).be.equal( 'Error' );
            done();
        });
    });

    it('Should check getPrices', done => {

        SERVICE.getPrices( _.get( PRODUCT, ['products', 0], '') )
        .then( result => {

            SHOULD(result).be.an.Array;
            SHOULD( result.length ).be.equal(3);
            SHOULD( _.get( result, [0, 'exchange'], '') ).be.equal('BNB');
            SHOULD( _.get( result, [1, 'exchange'], '') ).be.equal('BTX');
            SHOULD( _.get( result, [2, 'exchange'], '') ).be.equal('BFX');

            done();
        })
        .catch ( err => {
            SHOULD(err).be.equal( 'Error' );
            done();
        });

    });

});