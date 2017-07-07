var AxeBuilder = require('axe-webdriverjs');
var WebDriver = require('selenium-webdriver');
var fs = require('fs');

var contents = fs.readFileSync("config.json");
var configs = JSON.parse(contents);

var driver = new WebDriver.Builder()
  .forBrowser('chrome')
  .build();

driver.manage().timeouts().setScriptTimeout(30000);

driver.get(configs.server).then(function() {
  driver.findElement({id:'user'}).sendKeys(configs.user);
  driver.findElement({id:'pass'}).sendKeys(configs.password);
  driver.findElement({id:'login_submit'}).click();
});

driver.sleep(1000);

driver.getCurrentUrl().then(function(url) {
  var page = url;
  if ( configs.page.length > 0 ) {
    var pots = url.split("/");
    page = pots[0].concat("//", pots[2], "/", pots[3], configs.page);
  }

  driver
    .get(page)
    .then(function () {
      AxeBuilder(driver)
        .analyze(function(results) {
          console.log(results);
        });
    });
});

driver.quit();
