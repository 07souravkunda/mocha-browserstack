var assert = require('assert');
const { Builder, By, Capabilities, until } = require("selenium-webdriver");
require('chromedriver');

var buildDriver = function() {
  return new Builder()
              .forBrowser("chrome")
              .build();
};

describe('BStackDemo', async function() {
  this.timeout(0);
  let driver;

  before(function() {
    driver = buildDriver();
  });

  it('loads page correctly', async function () {
    await driver.get('https://bstackdemo.com/');
    await driver.wait(until.titleMatches(/StackDemo/i), 10000);

    let title = await driver.getTitle();
    assert(title.match(/StackDemo/i) != null);
  });

  after(async function() {
    await driver.quit();
  });
});
