import table from "markdown-table";
import { request } from "https";
import { write } from "../../exec";
import { logger, rootDir, options, username } from "../../constants";
import { createPath } from "../../common";

async function referrers(name) {
  await createPath(`${rootDir}/${name}/.github/traffic/`);
  const path = `${rootDir}/${name}/.github/traffic/referrers.md`;
  options.path = `/repos/${username}/${name}/traffic/popular/referrers`;

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
          content.forEach((c) => {
            const row = [];
            row.push(c.referrer);
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

export default referrers;
