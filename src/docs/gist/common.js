import { readdirSync } from "fs";
import { request } from "https";
import { logger, options, reposDir } from "../../common/constants";
import { write } from "../../exec";
import updateGist from "../../data/gist/patch_gist";

// returns filtered repositories
function getFilteredRepos(first, second, third, fourth) {
  const list = [];
  try {
    const files = readdirSync(reposDir);

    for (let i = 1; i < files.length; i += 1) {
      const repos = require(`../../../repos/repo-${i}.json`);
      repos.forEach((repo) => {
        const { name } = repo;
        const parts = name.split("-");
        if (parts.includes(first) && parts.includes(second)) {
          if (third) {
            if (fourth) {
              if (parts.includes(third) && parts.includes(fourth)) {
                list.push(name);
              }
            } else if (parts.includes(third)) {
              list.push(name);
            }
          } else {
            list.push(name);
          }
        }
      });
    }
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }

  return list;
}

async function buildGistList() {
  try {
    const list = [];
    const gists = require("../../../gists/gists.json");
    // logger.info(gists)
    gists.forEach((gist) => {
      if (gist.description) {
        list.push(gist.description);
      } else {
        logger.info(gist.files);
      }
    });
    const path = "./gists/list.json";
    const data = JSON.stringify([...new Set(list)].sort(), null, 2);

    write(path, data, "utf8");
  } catch (error) {
    logger.error(`${__filename}, Build Gist list error`);
  }
}

// create a new gist if not exist
function createGist(content, fileName) {
  try {
    const path = `/gists`;
    const list = require("../../../gists/list.json");
    options.path = path;
    options.method = "POST";
    options.headers["X-Github-Username"] = "xgirma";
    options.headers["Content-Type"] = "application/json";

    const data = JSON.stringify(content);

    options.headers["Content-Length"] = data.length;

    if (!list.includes(fileName)) {
      const req = request(options, (response) => {
        response.on("error", (error) => {
          throw error;
        });

        logger.info(`${fileName}, Gist created, POST, Code: ${response.statusCode}, Path: ${path}.`);
      });

      req.write(data);

      req.on("error", (error) => {
        throw error;
      });

      req.end();
    } else {
      logger.info(`${fileName} already exist`);
    }
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }
}

export { buildGistList, createGist, getFilteredRepos, updateGist };
