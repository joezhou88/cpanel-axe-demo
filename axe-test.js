require('chromedriver');
var AxeBuilder = require('axe-webdriverjs');
var WebDriver = require('selenium-webdriver');
var fs = require('fs');
var util = require('util');

var contents = fs.readFileSync("config.json");
var configs = JSON.parse(contents);

var driver = new WebDriver.Builder()
  .forBrowser('chrome')
  .build();

// increase timeout to 30 seconds
// default not enough for AxeBuilder to run 
driver.manage().timeouts().setScriptTimeout(30000);

driver.get(configs.server).then(function() {
  driver.findElement({id:'user'}).sendKeys(configs.user);
  driver.findElement({id:'pass'}).sendKeys(configs.password);
  driver.findElement({id:'login_submit'}).click();
});

// allow time to transition away from login page
driver.sleep(1000);

driver.getCurrentUrl().then(function(url) {
  var page = url;

  // splice out session token and add page url
  if ( configs.page.length > 0 ) {
    var pots = url.split("/");
    page = pots[0].concat("//", pots[2], "/", pots[3], configs.page);
  }

  driver
    .get(page)
    .then(function () {
      AxeBuilder(driver)
        .analyze(function(results) {
          Object.keys(results).forEach(function(statusKey) {
            if (Array.isArray(results[statusKey])) {
              results[statusKey].forEach(function(statusItem) {
                statusItem["nodes"].forEach(function(node) {
                  var nodeKeys = ["all", "any", "none", "impact", "target"];
                  nodeKeys.forEach(function(key){
                    delete node[key];
                  });
                });
              });
            }
          });
          console.log(JSON.stringify(results, null, '    '));
        });
    });
});

driver.quit();
