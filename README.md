# glovo-fullstack-engineer-challenge

NodeJs sample application for Glovo Fullstack Engineer Challenge. To create backend and frontend for task.

### Where to submit Queries/issues?
Issues related to application can be submitted here https://github.com/navinbisht1992/glovo-fullstack-engineer-challenge/issues

### Versions used
 - node v8.10.0
 - npm 6.4.1

## Before you proceed
 - Install dependencies from respective directives of backend and frontend using:
 ```
 npm install
 or
 npm i
 ```
 - Since using Secure network too with unverified certificates, thus do accept backend and frontend certificates on browser if using Secure Server. Paste following on browser and accept certificates.
 ```
https://localhost:4000/
https://localhost:3000/
 ```

### What is NPM?
 - npm is the package manager for JavaScript and the world’s largest software registry. Discover packages of reusable code — and assemble them in powerful new ways.
 - To install nodeJs and NPM: https://nodejs.org/en/

### How to maintain different versions of node?
 - Node Version Manager (NVM) is used to maintain different node version in same machine.
 - To install or update nvm, you can use the install script using cURL:
 As a matter of best practice we’ll update our packages:
 ```
  apt-get update
 ```
 The build-essential package should already be installed, however, we’re going still going to include it in our command for installation:
 ```
 apt-get install build-essential libssl-dev
 ```
 Use the following curl command to kick-off the install script:
 ```
 curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
 ```
 After running the above command, you may receive output similar to the following:
 ```
 Close and reopen your terminal to start using nvm
 ```
 Either do as the output suggests, and close and reopen your terminal session, or run the following command:
 ```
 source ~/.profile
 ```
 We can quickly verify that NVM is now installed and working properly with the following command:
 ```
 nvm --version
 ```
 Another very useful command to get you started on node.js management is:
 ```
 nvm help
 ```
 Follow instructions from `nvm help` to install different `node` version.

### Application tree
```
1. backend
└─ 1. config
|  ├─ 1. encryption
|  └─ 2. product.js
├─ 2. lib
|  ├─ 1. index.js
|  ├─ 2. logger.js
|  └─ 3. service.js
├─ 3. router
|  └─ 1. index.js
├─ 4. test
|  ├─ 1. lib.js
|  ├─ 2. router.js
|  └─ 3. service.js
├─ 5. app.js
├─ 6. package-lock.json
├─ 7. package.json
|
|
2. frontend
├─ 1. config
|  └─ 1. encryption
├─ 2. public
|  ├─ 1. css
|  |  ├─ 1. bootstrap
|  |  ├─ 2. fontAwesome
|  |  └─ 3. app.css
|  ├─ 2. js
|  |  ├─ 1. app.js
|  |  └─ 2. jquery.min.js
|  ├─ 3. logo.jpg
|  └─ 4. logo_green.svg
├─ 3. views
|  └─ 1. index.ejs
├─ 4. app.js
├─ 5. package-lock.json
├─ 6. package.json
|
|
3. .gitignore
|
|
4. README.md
|
|
2. sample_UI_preview
├─ 1. google_chrome_1.png
├─ 2. google_chrome_2.png
├─ 3. google_chrome_3.png
├─ 4. google_chrome_4.png
├─ 5. google_chrome_5.png
├─ 6. moxilla_firefox_1.png
├─ 7. moxilla_firefox_2.png
├─ 8. moxilla_firefox_3.png
└─ 9. moxilla_firefox_4.png
```

### How to run test for Backend?
 - Using Mocha for unit test. Test case are writen in `backend/test/`. Testing only selective functions from selective modules:
 ```
 lib/index.js (getProducts, getPrices)
 lib/service.js (setProducts, getPrices)
 router/index.js (GET: /products, GET: /products/PRODUCT/prices)
 ```
 - To run test case:
 ```
 npm test    // Test result will be saved in file backend/report
 or
 mocha test --timeout 20000     // 20 Sec timeout as some API call may take more time
 mocha -R spec test --timeout 20000 > report 2>&1    // To save test report in a file
 mocha -R spec test  --timeout 120000 2>&1 | tee report     // To test report in a file and on console too
 ```

### How to start application?
 - Method 1 using `node` from backend and frontend directives:
 ```
 node app / node app.js
 ```
 - Method 2 using `npm` from backend and frontend directives:
 ```
 npm start
 ```
 - Method 3 using `npm forever` and `npm forever-monitor` from backend and frontend directives:
 ```
 // Install forever
 npm i forever -g
 // Install forever-monitor
 npm i forever-monitor
 forever start app.js
 ```

### How to check logs?
 - To check logs for Moneeda API calls and other logs on backend:
 ```
 // All logs
 tail -f logger.log

 // Error logs
 tail -f error.log
 ```
 
### How to stop application?
 - Started using method 1 from backend and frontend directives:
 ```
 ctrl c
 ```
 - Started using method 2 using from backend and frontend directives:
 ```
 ctrl c
 ```
 - Started using method 3 from backend and frontend directives:
 ```
 forever stop app.js
 // If task is lost in forever than
 forever stop all
 ```

### Backend Description
 - Provides two GET API /product and /product/PRODUCT/prices
 - Fetch 3 exchanges products using Moneeda API `/api/exchanges/EXCHANGE/products`.
 - Fetch 3 exchanges price for different products using Moneeda API `/api/exchanges/EXCHANGE/ticker`.
 - Caching following details fetched from Moneeda API, to improve response time:
 ```
 exchanges          = ['BNB', 'BTX', 'BFX'];
 products           = [];     // ['A', 'B', 'C', .....]
 lastFiveSearch     = [];     // [{id: 'A', prices: [{exchange: 'BNB', price: 0.776....}, {...}, {...}] }, {....}, ....]
 topFiveSearch      = [];     // [{id: 'A', prices: [{exchange: 'BNB', price: 0.776....}, {...}, {...}] }, {....}, ....]
 searchFrequency    = {};     // {'A': 8, 'B': 1, 'C': 5, ....}
 ```
 - Updating cached details on regular interval using cron-job based on assumption taken, that prices and products keep on changing (On dev-server thus field are not changing).
 - Multiple services are created to improve efficiency:
 ```
 hitHttpApi               // Make call to Moneeda API
 setProducts              // Update and set common products of BNB, BTX and BFX in products
 getPrices                // Fetch BNB, BTX and BFX prices for product ID from Moneeda API
 setSearchFrequency       // Set search frequency for new products to 0.
 setLastFiveSearch        // Set and update lastFiveSearch.
 setTopFiveSearch         // Set and update prices for top 5 searched product ID into topFiveSearch
 ```

### Frontend Description
 - Single Page Application.
 - Using Bootstrap CSS, Font Awesome CSS, jQuery, internal CSS and JavaScript.
 - Allow user to select and view prices for different product ID from BNB, BTX and BFX exchange.
 - Fetch products list from backend API `/products`.
 - Fetch prices for selected product ID from backend API `/products/PRODUCT/prices`.

### Sample UI Preview
 - Screenshots of UI preview on 100% window for Google Chrome and Mozilla Firefox.