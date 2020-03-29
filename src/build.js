/* eslint-disable camelcase */
import table from "markdown-table";
import { writeFileSync } from "fs";
import { request } from "https";
import { logger, rootDir, miscRepos, workflow, options, username } from "./constants";

const moment = require("moment");

function jobs(name, id, callback) {
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
              jobSteps.push(data);
            }
          });
        }
        callback(jobSteps);
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

function badge(label, message, color) {
  return `![${label} ${message}](https://img.shields.io/badge/${label}-${message}-${color})`;
}

function jobStatus(status, label, message) {
  const job = [];

  if (status === "success") {
    job.push(badge(label, message, "brightgreen"));
  }

  if (status === "failure") {
    job.push(badge(label, message, "red"));
  }

  if (status === "skipped") {
    job.push(badge(label, message, "lightgray"));
  }

  return job;
}

async function buildResults(repo) {
  try {
    const { name } = repo;

    if (!miscRepos.includes(name)) {
      const runs = [];
      runs.push(["No", "Date", "Build"]);

      const { workflow_runs } = require(`${rootDir}/${name}/.github/runs.json`);

      workflow_runs.forEach((run) => {
        const { id, run_number, updated_at, conclusion, html_url } = run;
        const pass = `[![Conclusion](https://img.shields.io/badge/build-pass-brightgreen)](${html_url})`;
        const fail = `[![Conclusion](https://img.shields.io/badge/build-fail-red)](${html_url})`;
        const updatedAt = moment(updated_at).format("DD/MM/YY HH:mm");

        const status = conclusion === "success" ? pass : fail;

        jobs(name, id, (steps) => {
          const job = [];

          steps.forEach((step) => {
            if (step.name === "npm:install") {
              job.push(jobStatus(step.conclusion, "npm", "install"));
            }

            if (step.name === "install:linux") {
              job.push(jobStatus(step.conclusion, "install", "install"));
            }

            if (step.name === "lint") {
              job.push(jobStatus(step.conclusion, "run", "lint"));
            }

            if (step.name === "build") {
              job.push(jobStatus(step.conclusion, "run", "build"));
            }

            if (step.name === "update:webdriver") {
              job.push(jobStatus(step.conclusion, "update", "webdriver"));
            }

            if (step.name === "start:webdriver") {
              job.push(jobStatus(step.conclusion, "start", "webdriver"));
            }

            if (step.name === "test") {
              job.push(jobStatus(step.conclusion, "run", "test"));
            }
          });

          const row = [run_number, updatedAt, status, ...job];
          runs.push(row);
          const path = `${rootDir}/${name}/.github/runs_status.md`;
          writeFileSync(path, table(runs, { align: "l" }), "utf8");
        });
      });
      logger.info(`write runs for ${name}`);
    }
  } catch (error) {
    logger.error(`Build ${"name"} ${error}`);
  }
}

export default buildResults;
