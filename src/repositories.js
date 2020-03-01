const fs = require("fs");
const https = require("https");
const { hasRepositoriesList, isNumeric } = require("./validators");
const { clearRepositoriesList } = require("./exec");
const { username, pages, logger } = require("./constants");

const options = {
  host: "api.github.com",
  method: "GET",
  headers: {
    "user-agent": "node.js",
    "Content-Type": "application/json"
  }
};

async function getRepositories() {
  try {
    const hasReposList = await hasRepositoriesList();

    if (hasReposList) {
      await clearRepositoriesList();
    }

    if (!isNumeric(pages || 2)) {
      throw new Error(`${pages} is not a valid page number.`);
    }

    for (let i = 0; i < (pages || 2); i += 1) {
      const path = `/users/${username}/repos?page=${i + 1}&per_page=100`;
      options.path = path;

      const request = https.request(options, response => {
        let body = "";
        response.on("data", chunk => {
          body += chunk.toString("utf8");
        });

        response.on("error", error => {
          throw error;
        });

        response.on("end", () => {
          const isOk = response.statusCode === 200;
          const content = isOk ? JSON.parse(JSON.stringify(body)) : "[]";
          if (isOk && content !== "[]") {
            fs.writeFileSync(`repos/repo-${i + 1}.json`, content);
            logger.info(`GET: ${path}.`);
          } else {
            logger.warn(`Not Found: ${path}.`);
          }
        });
      });

      request.end();
    }
  } catch (error) {
    logger.error(error);
  }
}

module.exports = {
  getRepositories
};
