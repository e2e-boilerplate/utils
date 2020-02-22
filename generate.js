const fs = require("fs");
const https = require("https");
const argv = require("minimist")(process.argv.slice(2));

const options = {
  host: "api.github.com",
  method: "GET",
  headers: {
    "user-agent": "node.js",
    "Content-Type": "application/json"
  }
};

for (let i = 0; i < argv.pages; i += 1) {
  options.path = `/users/e2e-boilerplates/repos?page=${i + 1}&per_page=100`;

  const request = https.request(options, response => {
    let body = "";
    response.on("data", chunk => {
      body += chunk.toString("utf8");
    });

    response.on("end", () => {
      const list = JSON.parse(JSON.stringify(body));
      fs.writeFileSync(`repos/repo-${i + 1}.json`, list);
    });
  });

  request.end();
}
