var AxeBuilder = require('axe-webdriverjs');
var WebDriver = require('selenium-webdriver');

var driver = new WebDriver.Builder()
  .forBrowser('firefox')
  .build();

driver.manage().timeouts().setScriptTimeout(30000);

driver
  .get('https://dequeuniversity.com/demo/mars/')
  .then(function () {
    AxeBuilder(driver)
      .analyze(function (results) {
        console.log(results);
      });
  });
