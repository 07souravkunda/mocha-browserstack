var assert = require('assert');
var webdriver = require('selenium-webdriver')
require('chromedriver');

var buildDriver = function() {
  return new webdriver
            .Builder()
            .forBrowser("chrome")
            .build();
};

describe('BStack test login', function() {
    this.timeout(0);
    let driver;

    before(() => {
        driver = buildDriver();
    });

    it('logins and redirects to product page', async () => {
      await driver.get("https://www.bstackdemo.com/signin");
      await driver.findElement({css: '#username input'}).sendKeys('demouser\t');
      await driver.findElement({css: '#password input'}).sendKeys('testingisfun99\t');
      await driver.findElement({id: 'login-btn'}).click();
    
      await driver.wait(webdriver.until.titleMatches(/StackDemo/i), 10000);

      let title = await driver.getTitle();
      assert(title.match(/StackDemo/i) != null);
  });

    after(async () => {
        driver.quit()
    });
});
