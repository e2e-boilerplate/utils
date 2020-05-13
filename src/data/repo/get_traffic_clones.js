import { request } from "https";
import { writeFileSync } from "fs";
import { rootDir, logger, options, username } from "../../common/constants";

/**
 * Implements: https://developer.github.com/v3/repos/traffic/#clones
 * GET /repos/:owner/:repo/traffic/clones
 * repo: repository name
 */
function getRepoTrafficClones(repo) {
  try {
    const path = `/repos/${username}/${repo}/traffic/clones`;
    options.path = path;
    options.headers["X-Github-Username"] = "xgirma";
    delete options.headers["Content-Type"];

    const req = request(options, (response) => {
      let body = "";
      response.on("error", (error) => {
        throw error;
      });

      response.on("data", (chunk) => {
        body += chunk.toString("utf8");
      });

      response.on("end", () => {
        if (response.statusCode === 200) {
          const data = JSON.parse(body);
          const content = {
            count: data.count ? data.count : "",
            uniques: data.uniques ? data.uniques : "",
          };
          writeFileSync(`${rootDir}/docs/traffic/data/clones/${repo}.json`, JSON.stringify(content, null, 2), "utf8");
          logger.info(`${__filename}: GET: ${path}.`);
        } else {
          logger.warn(`${__filename}: Not Found: ${path}. Code: ${response.statusCode}`);
        }
      });
    });

    req.on("error", (error) => {
      throw error;
    });

    req.end();
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }
}

export default getRepoTrafficClones;
