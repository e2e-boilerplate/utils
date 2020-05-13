import { request } from "https";
import { writeFileSync } from "fs";
import { logger, options, username, rootDir } from "../../common/constants";

/**
 * https://developer.github.com/v3/repos/traffic/#list-referrers
 * GET /repos/:owner/:repo/traffic/popular/referrers
 * repo: repository name
 */
function getTrafficReferrers(repo) {
  try {
    const path = `/repos/${username}/${repo}/traffic/popular/referrers`;
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
        const isOk = response.statusCode === 200;
        const content = isOk ? JSON.parse(JSON.stringify(body, null, 2)) : "[]";
        if (isOk) {
          writeFileSync(`${rootDir}/docs/traffic/data/referrers/${repo}.json`, content, "utf8");
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

export default getTrafficReferrers;
