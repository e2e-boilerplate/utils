import { writeFileSync } from "fs";
import { request } from "https";
import { isNumeric } from "../../validators";
import { username, logger, options, pages } from "../../common/constants";

/**
 * Implements: https://developer.github.com/v3/gists/#list-gists-for-a-user
 * GET /users/:username/gists
 */
function getGists() {
  try {
    const count = isNumeric(pages) ? pages : 2;

    for (let i = 0; i < count; i += 1) {
      const path = `/users/${username}/gists?page=${i + 1}&per_page=100`;
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
          const content = isOk ? JSON.parse(JSON.stringify(body)) : "[]";
          if (isOk && content !== "[]") {
            writeFileSync(`gists/gists.json`, content);
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
    }
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }
}

export default getGists;
