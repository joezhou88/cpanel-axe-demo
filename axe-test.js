var AxeBuilder = require('axe-webdriverjs');
var WebDriver = require('selenium-webdriver');

var driver = new WebDriver.Builder()
  .forBrowser('firefox')
  .build();

driver.manage().timeouts().setScriptTimeout(30000);

driver
  .get('https://joe64.dev.cpanel.net:2087/')
  .then(function () {
    AxeBuilder(driver)
      .analyze(function (results) {
        console.log(results);
      });
  });
