/*jshint multistr: true, node: true, esversion: 6, undef: true, unused: true, varstmt: true*/
"use strict";

class Products {
    constructor () {
        this.exchanges          = ['BNB', 'BTX', 'BFX'];
        this.products           = [];     // ['A', 'B', 'C', .....]
        this.lastFiveSearch     = [];     // [{id: 'A', prices: [{exchange: 'BNB', price: 0.776....}, {...}, {...}] }, {....}, ....]
        this.topFiveSearch      = [];     // [{id: 'A', prices: [{exchange: 'BNB', price: 0.776....}, {...}, {...}] }, {....}, ....]
        this.searchFrequency    = {};     // {'A': 8, 'B': 1, 'C': 5, ....}
    }
}

module.exports = new Products();