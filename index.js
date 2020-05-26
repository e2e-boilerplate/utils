const gp = require("gh-pages");

gp.publish("api", function (error) {
  console.error(`error: ${error}`);
});
