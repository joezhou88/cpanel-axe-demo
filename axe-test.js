var AxeBuilder = require('axe-webdriverjs');
var WebDriver = require('selenium-webdriver');

var driver = new WebDriver.Builder()
  .forBrowser('firefox')
  .build();

driver.manage().timeouts().setScriptTimeout(30000);

driver.get("https://joe64.dev.cpanel.net:2083/");
driver.findElement({id:'user'}).sendKeys("joe");
driver.findElement({id:'pass'}).sendKeys("cpanel1");
driver.findElement({id:'login_submit'}).click();

driver.sleep(5000);

driver
  .get(driver.getCurrentUrl())
  .then(function () {
    AxeBuilder(driver)
      .analyze(function (results) {
        console.log(results);
      });
  });