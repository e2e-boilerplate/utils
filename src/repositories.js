import { writeFileSync } from "fs";
import { request } from "https";
import { hasRepositoriesList, isNumeric } from "./validators";
import { username, pages, logger, options } from "./constants";
import { clearReposList } from "./common";

async function getReposList() {
  try {
    const hasReposList = await hasRepositoriesList();

    if (hasReposList) {
      await clearReposList();
    }

    const count = isNumeric(pages) ? pages : 2;

    for (let i = 0; i < count; i += 1) {
      const path = `/users/${username}/repos?page=${i + 1}&per_page=100`;
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
            writeFileSync(`repos/repo-${i + 1}.json`, content);
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
    }
  } catch (error) {
    logger.error(error);
  }
}

export { getReposList, clearReposList };
