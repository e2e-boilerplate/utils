import { readdirSync } from "fs";
import { request } from "https";
import { logger, options, reposDir } from "../../constants";

function getGistId(fileName) {
  let id;
  const gists = require(`../../../gists/gists.json`);
  gists.forEach((gist) => {
    if (gist.description === fileName) {
      id = gist.id;
    }
  });
  return id;
}

function getRepos(x, y, z) {
  const list = [];
  try {
    const files = readdirSync(reposDir);

    for (let i = 1; i < files.length; i += 1) {
      const repos = require(`../../../repos/repo-${i}.json`);
      repos.forEach((repo) => {
        const { name } = repo;
        const parts = name.split("-");
        if (parts.includes(x) && parts.includes(y)) {
          if (z) {
            if (parts.includes(z)) {
              list.push(name);
            }
          } else {
            list.push(name);
          }
        }
      });
    }
  } catch (error) {
    logger.error(error);
  }

  return list;
}

function updateGist(content, fileName) {
  try {
    const id = getGistId(fileName);
    const path = `/gists/${id}`;
    options.path = path;
    options.method = "PATCH";
    options.headers["X-Github-Username"] = "xgirma";
    options.headers["Content-Type"] = "application/x-www-form-urlencoded";
    const body = {
      description: fileName,
      files: {},
    };

    body.files[fileName] = {
      content,
      filename: fileName,
    };

    const data = JSON.stringify(body);

    const req = request(options, (response) => {
      response.on("error", (error) => {
        throw error;
      });

      response.on("end", () => {
        const isOk = response.statusCode === 200;
        if (isOk) {
          logger.info(`GET: ${path}.`);
        } else {
          logger.warn(`Code: ${response.statusCode} Path: ${path}.`);
        }
      });
    });

    req.write(data);

    req.on("error", (error) => {
      throw error;
    });

    req.end();
  } catch (error) {
    logger.error(error);
  }
}

function hasGist(fileName) {
  let has;
  try {
    has = false;
    const gists = require("../../../gists/gists.json");
    gists.forEach((gist) => {
      if (gist.files[fileName]) {
        has = true;
      }
    });
  } catch (error) {
    logger.error(error);
  }

  return has;
}

// create a new gist if not exist
function createGist(content, fileName) {
  try {
    const path = `/gists`;
    options.path = path;
    options.method = "POST";
    options.headers["X-Github-Username"] = "xgirma";
    options.headers["Content-Type"] = "application/json";

    const data = JSON.stringify(content);

    options.headers["Content-Length"] = data.length;

    if (!hasGist(fileName)) {
      const req = request(options, (response) => {
        response.on("error", (error) => {
          throw error;
        });

        response.on("end", () => {
          const isCreated = response.statusCode === 201;
          if (isCreated) {
            logger.info(`POST: ${path}.`);
          } else {
            logger.warn(`Code: ${response.statusCode} Path: ${path}`);
          }
        });
      });

      req.write(data);

      req.on("error", (error) => {
        throw error;
      });

      req.end();
    }
  } catch (error) {
    logger.error(error);
  }
}

export { createGist, getGistId, getRepos, updateGist };
