var AxeBuilder = require('axe-webdriverjs');
var WebDriver = require('selenium-webdriver');
var fs = require('fs');

var contents = fs.readFileSync("config.json");
var configs = JSON.parse(contents);

var driver = new WebDriver.Builder()
  .forBrowser('firefox')
  .build();

driver.manage().timeouts().setScriptTimeout(30000);

driver.get(configs.url);
driver.findElement({id:'user'}).sendKeys(configs.user);
driver.findElement({id:'pass'}).sendKeys(configs.password);
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