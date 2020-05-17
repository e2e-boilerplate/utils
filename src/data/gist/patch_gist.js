import { request } from "https";
import { logger, options } from "../../common/constants";

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

/**
 * Implements: https://developer.github.com/v3/gists/#update-a-gist
 * PATCH /gists/:gist_id
 */
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

      logger.info(`Gist update, PATCH, Code: ${response.statusCode}, Path: ${path}.`);
    });

    req.write(data);

    req.on("error", (error) => {
      throw error;
    });

    req.end();
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }
}

export default updateGist;
