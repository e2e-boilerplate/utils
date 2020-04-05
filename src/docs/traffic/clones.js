import table from "markdown-table";
import { request } from "https";
import { write } from "../../exec";
import { logger, rootDir, options, username } from "../../constants";
import { createPath } from "../../common";

const moment = require("moment");

async function paths(name) {
  await createPath(`${rootDir}/${name}/.github/traffic/`);
  const path = `${rootDir}/${name}/.github/traffic/clones.md`;
  options.path = `/repos/${username}/${name}/traffic/clones?per=day`;

  try {
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
        const content = isOk ? JSON.parse(`${body}`) : "[]";

        if (isOk && content !== "[]") {
          const data = [["referrer", "count", "uniques"]];
          const { clones } = content;
          clones.forEach((c) => {
            const row = [];
            const timestamp = moment(c.timestamp).format("DD/MM/YY HH:mm:ss");
            row.push(timestamp);
            row.push(c.count);
            row.push(c.uniques);
            data.push(row);
          });
          write(path, table(data, { align: "l" }), "utf8");
          logger.info(`traffic:views: ${name}`);
        }
      });
    });

    req.on("error", (error) => {
      throw error;
    });

    req.end();
  } catch (error) {
    logger.error(`Jobs ${name} ${error}`);
  }
}

export default paths;
