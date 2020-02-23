const fs = require("fs");
const https = require("https");
const argv = require("minimist")(process.argv.slice(2));
const logger = require("./src/logger");
const { checkRepoNameList } = require("./src/checklist");

const options = {
  host: "api.github.com",
  method: "GET",
  headers: {
    "user-agent": "node.js",
    "Content-Type": "application/json"
  }
};

async function getRepositoryNameList() {
  await checkRepoNameList(false);

  logger.info("Getting new repositories name.");

  for (let i = 0; i < argv.pages; i += 1) {
    options.path = `/users/e2e-boilerplates/repos?page=${i + 1}&per_page=100`;

    const request = https.request(options, response => {
      let body = "";
      response.on("data", chunk => {
        body += chunk.toString("utf8");
      });

      response.on("end", () => {
        const list = JSON.parse(JSON.stringify(body));
        try {
          fs.writeFileSync(`repos/repo-${i + 1}.json`, list);
        } catch (error) {
          logger.error(error);
        }
      });
    });

    request.end();
  }
}

getRepositoryNameList();
