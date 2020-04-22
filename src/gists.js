import { writeFileSync } from "fs";
import { request } from "https";
import { username, logger, options } from "./constants";

function getGistsList() {
  try {
    const path = `/users/${username}/gists`;
    options.path = path;

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
          logger.info(`GET: ${path}.`);
        } else {
          logger.warn(`Not Found: ${path}.`);
        }
      });
    });

    req.on("error", (error) => {
      throw error;
    });

    req.end();
  } catch (error) {
    logger.error(error);
  }
}

getGistsList();

// eslint-disable-next-line import/prefer-default-export
export { getGistsList };
