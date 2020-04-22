import { readdirSync } from "fs";
import { request } from "https";
import { hasMatchingRepositoriesList, hasRepositoriesList, hasRootDirectory } from "../../validators";
import { getRepositoriesList, setRootDir } from "../../exec";
import { clearReposList } from "../../common";
import { logger, options, reposDir } from "../../constants";

async function getGistId() {
  let id;
  const gists = require(`../../../gists/gists.json`);
  gists.forEach((gist) => {
    if (gist.description === "e2e-boilerplate") {
      id = gist.id;
    }
  });
  return id;
}

async function getRepos(x, y, z) {
  const list = [];
  try {
    const hasRootDir = await hasRootDirectory();
    if (!hasRootDir) {
      await setRootDir();
    }

    const hasReposList = await hasRepositoriesList();
    if (!hasReposList) {
      await getRepositoriesList();
    }

    const hasMatchingReposList = await hasMatchingRepositoriesList();
    if (!hasMatchingReposList) {
      await clearReposList();
      await getRepositoriesList();
    }

    const files = readdirSync(reposDir);

    for (let i = 1; i < files.length; i += 1) {
      const repos = require(`../../../repos/repo-${i}.json`);
      repos.forEach((repo) => {
        const { name } = repo;
        const parts = name.split("-");
        console.log(name);
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

async function writeGist(content, fileName) {
  try {
    const id = await getGistId();
    const path = `/gists/${id}`;
    options.path = path;
    options.method = "PATCH";
    const body = {
      description: "Hello World Examples",
      files: {},
    };

    body.files[fileName] = {
      content,
      filename: fileName,
    };

    const data = JSON.stringify(body);

    options.headers["Content-Length"] = data.length;

    console.log(options);

    const req = request(options, (response) => {
      response.on("error", (error) => {
        throw error;
      });

      response.on("data", (chunk) => {
        logger.info(`/gists/${id}, for ${fileName} statusCode: ${chunk.statusCode}`);
      });

      response.on("end", () => {
        console.log(`.........`, response.statusCode);
        const isOk = response.statusCode === 200;
        if (isOk) {
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

export { getGistId, getRepos, writeGist };
