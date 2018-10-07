/*jshint multistr: true, node: true, esversion: 6, undef: true, unused: true, varstmt: true*/
"use strict";

// NPM Modules
const express                     = require('express'),
      FS                          = require('fs'),
      getPort                     = require('get-port'),
      HTTPS                       = require('https'),
      path                        = require('path');

const app                         = express();

// Setup views directory, file type and public filder.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Redirect all calls to '/' as this is only available route
app.use('/', function(req, res, next) {
    let url = req.url.split('/')[1];

    if ( !url ) {
        next();
    } else {
        req.secure ?
          res.redirect(`https://${req.headers.host}/`)
          :
          res.redirect(`http://${req.headers.host}/`);
    }
});

app.get('/', (req, res) => {
    res.render('index');
});

let port                      = process.env.PORT || 3000;
port                          = parseInt(port);

// Certificate files for Secure Server
const key                     = FS.readFileSync( './config/encryption/private.key' ),
      cert                    = FS.readFileSync( './config/encryption/mydomain.crt' ),
      ca                      = FS.readFileSync( './config/encryption/mydomain.crt' );

(async () => {
    port                      = await getPort({port});

    console.log('Server listening at http://127.0.0.1 over port: ', port + 1);
    console.log('Secure server listening at https://127.0.0.1 over port: ', port);

    // Creating Secure Server
    HTTPS.createServer( {key, cert, ca}, app).listen(port);

    // Creating non-Secure Server
    app.listen(port + 1);
})();
