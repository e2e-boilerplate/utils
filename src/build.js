/* eslint-disable camelcase */
import table from "markdown-table";
import { logger, rootDir, miscRepos } from "./constants";
import { write } from "./exec";

const moment = require("moment");

const runs = [];

async function buildResults(repo) {
  runs.push(["No", "Updates at", "Conclusion"]);

  try {
    const { name } = repo;

    if (!miscRepos.includes(name)) {
      const { workflow_runs } = require(`${rootDir}/${name}/.github/runs.json`);

      workflow_runs.forEach((run) => {
        const { run_number, updated_at, conclusion, html_url } = run;
        const pass = `[![Conclusion](https://img.shields.io/badge/build-pass-brightgreen)](${html_url})`;
        const fail = `[![Conclusion](https://img.shields.io/badge/build-fail-red)](${html_url})`;
        const updatedAt = moment(updated_at).format("DD-MM-YYYY HH:mm:ss");

        const status = conclusion === "success" ? pass : fail;
        const r = [run_number, updatedAt, status];
        runs.push(r);
      });

      const path = `${rootDir}/${name}/.github/runs_status.md`;
      await write(path, table(runs, { align: "l" }), "utf8");
      logger.info(`write runs for ${name}`);
    }
  } catch (error) {
    logger.error(`Build ${"name"} ${error}`);
  }
}

export default buildResults;
