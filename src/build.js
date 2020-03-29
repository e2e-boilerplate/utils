/* eslint-disable camelcase */
import table from "markdown-table";
import { request } from "https";
import { logger, rootDir, miscRepos, workflow, options, username } from "./constants";
import { write } from "./exec";

const moment = require("moment");

function jobs(name, id) {
  return new Promise((resolve) => {
    options.path = `/repos/${username}/${name}/actions/runs/${id}/jobs`;

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
          const jobSteps = [];
          const isOk = response.statusCode === 200;
          const content = isOk ? JSON.parse(`${body}`) : "[]";

          if (isOk && content !== "[]") {
            const { steps } = content.jobs[0];
            steps.forEach((step) => {
              const data = {};
              if (workflow.includes(step.name)) {
                data.name = step.name;
                data.conclusion = step.conclusion;
                // logger.info(data.conclusion); // success,failure,skipped
                // logger.info(data.name); // success,failure,skipped
                jobSteps.push(data);
              }
            });
          }
          resolve(jobSteps);
        });
      });

      req.on("error", (error) => {
        throw error;
      });

      req.end();
    } catch (error) {
      logger.error(`Jobs ${name} ${error}`);
    }
  });
}

async function buildResults(repo) {
  try {
    const { name } = repo;

    if (!miscRepos.includes(name)) {
      const runs = [];
      runs.push(["No", "Updates at", "Conclusion"]);

      const { workflow_runs } = require(`${rootDir}/${name}/.github/runs.json`);

      workflow_runs.forEach((run) => {
        const { id, run_number, updated_at, conclusion, html_url } = run;
        const pass = `[![Conclusion](https://img.shields.io/badge/build-pass-brightgreen)](${html_url})`;
        const fail = `[![Conclusion](https://img.shields.io/badge/build-fail-red)](${html_url})`;
        const updatedAt = moment(updated_at).format("DD-MM-YYYY HH:mm:ss");

        const status = conclusion === "success" ? pass : fail;

        // const x = jobs(name, id, (cb) => {
        //   logger.warn(cb);
        //   return cb;
        // });
        const rr = jobs(name, id);

        logger.error(rr);
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
