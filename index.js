const gp = require("gh-pages");

gp.publish("api", function (error) {
  if (error) {
    console.error(`error: ${error}`);
  }
});
