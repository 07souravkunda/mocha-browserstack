var assert = require('assert'),
  webdriver = require('selenium-webdriver'),
  conf_file = process.argv[3] || 'conf/single.conf.js',
  parallel = require('mocha.parallel'),
  Promise = require('bluebird');

var capabilities = require('../' + conf_file).capabilities;

var buildDriver = function(caps) {
  return new Promise(function(resolve, reject) {
    var driver = new webdriver.Builder().
      usingServer('https://hub-cloud.browserstack.com/wd/hub').
      withCapabilities(caps).
      build();
    resolve(driver);
  });
};

parallel('Tests ', function() {
  var driver, bsLocal;

  capabilities.forEach(function(caps) {

    it('can add items to cart', function (done) {
      buildDriver(caps).then(function(driver) {
        driver.get('https://bstackdemo.com/').then(function() {
            driver.wait(webdriver.until.titleMatches(/StackDemo/i), 10000).then(function() {
            // locating product on webpage and getting name of the product
            driver.findElement(webdriver.By.xpath('//*[@id="1"]/p')).getText().then(function(productText) {
              // clicking the 'Add to cart' button
              driver.findElement(webdriver.By.xpath('//*[@id="1"]/div[4]')).click().then(function() {
                // waiting until the Cart pane has been displayed on the webpage
                driver.findElement(webdriver.By.className('float-cart__content')).then(function () {
                  // locating product in cart and getting name of the product in cart
                  driver.findElement(webdriver.By.xpath('//*[@id="__next"]/div/div/div[2]/div[2]/div[2]/div/div[3]/p[1]')).getText().then(async function (productCartText) {
                    try {
                      // checking whether product has been added to cart by comparing product name
                      assert(productText === productCartText);
                      //marking the test as Passed if product has been added to the cart
                      await driver.executeScript(
                        'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Product has been successfully added to the cart!"}}'
                      );
                      driver.quit().then(function() {
                        done();
                      });
                    } catch (ex) {
                        //marking the test as Failed if product has not been added to the cart
                        console.log("Error:", e.message)
                        await driver.executeScript(
                          'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Some elements failed to load."}}'
                        );
                    }
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
