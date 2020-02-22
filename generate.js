const fs = require("fs");
const https = require("https");

const options = {
  host: "api.github.com",
  path: "/users/e2e-boilerplates/repos",
  method: "GET",
  headers: { "user-agent": "node.js", "Content-Type": "application/json" }
};

const request = https.request(options, response => {
  let body = "";
  response.on("data", chunk => {
    body += chunk.toString("utf8");
  });

  response.on("end", () => {
    const list = JSON.parse(JSON.stringify(body));
    fs.writeFileSync("repos.json", list);
  });
});

request.end();
