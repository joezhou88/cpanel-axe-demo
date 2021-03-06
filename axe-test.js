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
  var baseURL = getBaseURL(url);

  configs.pages.forEach(function(page) {
    var url = baseURL;
    if ( page.length > 0 ) {
      url = url.concat(page);
    }
    scanURL(url);
  });
});

driver.quit();

/**
 * Gets the content of a page and do testing
 *
 * @param {String} page url
 * @return nothing
 * @api private
 */ 

function scanURL (url) {
  driver
    .get(url)
    .then(function () {

      // all page to load fully
      driver.sleep(2000);

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
          if ( configs.violations_only == 1 ) {
            delete results["incomplete"];
            delete results["inapplicable"];
            delete results["passes"];
          }
          console.log(JSON.stringify(results, null, '    '));
        });
    });
}

/**
 * Gets the url with security token if there is one
 * after login
 *
 * @param {String} initial url after login
 * @return {String} base url
 * @api private
 */ 

function getBaseURL (url) {
  var pots = url.split("/");
  var base = pots[0].concat("//", pots[2]);
  var pattern = /^cpsess\d+/;
  if (pattern.test(pots[3])) {
    base = base.concat("/", pots[3]);
  }
  return base;
}