import { request } from "https";
import { writeFileSync } from "fs";
import { logger, options, username } from "./constants";

function getStat(repo, type) {
  try {
    const path = `/repos/${username}/${repo}/traffic/${type}`;
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
          writeFileSync(`stat/traffic/${type}/${repo}.json`, JSON.stringify(content, null, 2), "utf8");
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

function getReferrers(repo) {
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
          writeFileSync(`stat/traffic/referrers/${repo}.json`, content, "utf8");
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

function traffic(repo) {
  getReferrers(repo);
  getStat(repo, "views");
  getStat(repo, "clones");
}

export default traffic;
