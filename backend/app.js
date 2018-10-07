/*jshint multistr: true, node: true, esversion: 6, undef: true, unused: true, varstmt: true*/
"use strict";

// NPM Modules
const cors                      = require('cors'),
      express                   = require('express'),
      FS                        = require('fs'),
      getPort                   = require('get-port'),
      HTTPS                     = require('https'),
// Internal Modules
      router                    = require('./router');

const app                       = express();

// IP's allowed all access this server
let whitelist = ['https://localhost:3000', 'https://localhost:1618',
                 'https://127.0.0.1:3000', 'https://127.0.0.1:1618',
                 'http://localhost:3001', 'http://localhost:1619',
                 'http://127.0.0.1:3001', 'http://127.0.0.1:1619'];

let corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// Cross-Origin Resource Sharing
app.use(cors(corsOptions));

router(app);

let port                      = process.env.PORT || 4000;
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
