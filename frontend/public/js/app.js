"use strict";

// URL for backend.
// Backend have same location as frontend except port.
// Backend Secure port is 4000 and normal is 4001
const url = `${window.location.protocol}//${window.location.hostname}:${ window.location.protocol === 'https:' ? 4000 : 4001 }`;

$(function() {
    getProducts();
});

function getProducts() {
    $("#refresh").addClass('fa-spin');
    hideAll();

    $.ajax({
        url: `${url}/products`,
        method: `GET`
    })
    .then( products => {

        let options = `<option value=""> Select </option>`;

        for (let product of products) {
        	options += `<option value="${product.toUpperCase()}"> ${product.toUpperCase()} </option>`;
        }

        $("#product").html(options);
        $("#refresh").removeClass('fa-spin');

        if (products.length === 0)
            $("#productError3").removeClass('hide');

    })
    .catch( err => {
        $("#productError1").removeClass('hide');
        $("#refresh").removeClass('fa-spin');

        let options = `<option value=""> Select </option>`;
        $("#product").html(options);

    });
}

function getPrices() {
    hideAll();
    $("#loading").removeClass('hide');

    let product = $("#product").val().toUpperCase();

    if ( !product ) {
        $("#productError2").removeClass('hide');
        $("#loading").addClass('hide');
        return;
    }

    $.ajax({
        url: `${url}/products/${product}/prices`,
        method: "GET"
    })
    .then( offers => {

        if (!offers.length) {
            offers.push({exchange: 'BNB'});
            offers.push({exchange: 'BTX'});
            offers.push({exchange: 'BFX'});
        }

        let labels = [],
            table  = [];

        for (let offer of offers) {
            labels.push( `${offer.exchange}: ${!isNaN(offer.price) ? offer.price : 'No Offer'}` );
            table.push( `<tr>
                            <th>PRICE</th>
                            <td>${!isNaN(offer.price) ? offer.price : 'No Offer'}</td>
                        </tr>
                        <tr class="borderGreen">
                            <th>HIGH</th>
                            <td>${!isNaN(offer.high) ? offer.high : 'No Offer'}</td>
                        </tr>
                        <tr>
                            <th>BID</th>
                            <td>${!isNaN(offer.bid) ? offer.bid : 'No Offer'}</td>
                        </tr>
                        <tr class="borderRed">
                            <th>LOW</th>
                            <td>${!isNaN(offer.low) ? offer.low : 'No Offer'}</td>
                        </tr>
                        <tr>
                            <th>ASK</th>
                            <td>${!isNaN(offer.ask) ? offer.ask : 'No Offer'}</td>
                        </tr>
                        <tr>
                            <th>VOLUME</th>
                            <td>${!isNaN(offer.volume) ? offer.volume : 'No Offer'}</td>
                        </tr>` );
        }

        for(let i = 0; i<labels.length; i++) {
            $(`#exchange${i+1}`).html(labels[i]);
            $(`#price${i+1}`).html(table[i]);
        }

        $("#showTable").removeClass('hide');
        $("#loading").addClass('hide');
    })
    .catch( err => {
        hideAll();
        $("#productError4").removeClass('hide');
    });
}

function hideAll() {
    $("#productError1").addClass('hide');
    $("#productError2").addClass('hide');
    $("#productError3").addClass('hide');
    $("#productError4").addClass('hide');
    $("#showTable").addClass('hide');
    $("#loading").addClass('hide');

    for (let i = 1; i<4; i++) {
        $(`#exchange${i}`).html('');
        $(`#price${i}`).html('');
    }
    return true;
}