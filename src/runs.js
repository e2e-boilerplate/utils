import { request } from "https";
import { logger, miscRepos, rootDir, username, options } from "./constants";
import { write } from "./exec";

async function runsResult(repo) {
  const { name } = repo;
  const path = `${rootDir}/${name}/.github/runs.json`;
  options.path = `/repos/${username}/${name}/actions/runs`;

  try {
    if (!miscRepos.includes(name)) {
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
            write(path, content);
            logger.info(`GET: ${options.path}.`);
          } else {
            logger.warn(`Not Found: ${options.path}.`);
          }
        });
      });

      req.on("error", (error) => {
        throw error;
      });

      req.end();
    }
  } catch (error) {
    logger.info(`actions error ${name} ${error}`);
  }
}

export default runsResult;
