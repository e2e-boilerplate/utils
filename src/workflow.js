import { safeDump } from "js-yaml";
import { readFileSync } from "fs";
import { logger, rootDir } from "./constants";
import { clear, createPath, getFrameworkName, getRandomCron, hasPath } from "./common";
import { write } from "./exec";

async function workflow(repo) {
  const { name } = repo;
  const parts = name.split("-");
  const cron = getRandomCron();
  const nodejs = {
    name,
    on: { push: null, schedule: [{ cron }] },
    jobs: {
      build: {
        "runs-on": "ubuntu-latest",
        steps: [
          { uses: "actions/checkout@v2" },
          {
            name: "NPM_INSTALL",
            uses: "actions/setup-node@v1",
            with: { "node-version": "12.x" },
          },
        ],
      },
    },
  };

  try {
    const data = readFileSync(`${rootDir}/${name}/package.json`);
    const pkgJson = JSON.parse(data);
    const { scripts } = pkgJson;
    const keys = Object.keys(scripts).sort();

    if (getFrameworkName(name) === "Playwright") {
      const aptGet = {
        name: "INSTALLING_LINUX_PACKAGES",
        run:
          "sudo apt-get update\nsudo apt-get install libwoff1 libopus0 libwebp6 libwebpdemux2 libenchant1c2a libgudev-1.0-0 libsecret-1-0 libhyphen0 libgdk-pixbuf2.0-0 libegl1 libgles2 libevent-2.1-6 libnotify4 libxslt1.1\nsudo apt-get install xvfb\n",
      };
      nodejs.jobs.build.steps.push(aptGet);
    }

    const installNamModules = { run: "npm install", env: { CI: true } };
    const lint = { name: "LINT", run: "npm run lint --if-present" };
    const build = { name: "BUILD", run: "npm run build --if-present" };
    nodejs.jobs.build.steps.push(installNamModules);
    nodejs.jobs.build.steps.push(lint);
    nodejs.jobs.build.steps.push(build);

    if (keys.includes("update:webdriver")) {
      const update = { name: "UPDATING_WEBDRIVER", run: "npm run update:webdriver" };
      nodejs.jobs.build.steps.push(update);
    }

    if (keys.includes("start:webdriver")) {
      const start = { name: "START_WEBDRIVER", run: "npm run start:webdriver &" };
      nodejs.jobs.build.steps.push(start);
    }

    // TODO run nightwatch headless with one config
    if (keys.includes("test:ci")) {
      const test = { name: "EXECUTING_TESTS", run: "npm run test:ci" };
      nodejs.jobs.build.steps.push(test);
    } else if (keys.includes("test")) {
      if (parts.includes("cypress")) {
        const test = { name: "EXECUTING_TESTS", run: "npm run test -- --headless" };
        nodejs.jobs.build.steps.push(test);
      } else {
        const test = { name: "EXECUTING_TESTS", run: "npm run test" };
        nodejs.jobs.build.steps.push(test);
      }
    }

    if (getFrameworkName(name) === "cypress") {
      const clearVideo = {
        name: "REMOVING_CYPRESS_VIDEO",
        run: "npm run clean:video",
      };
      nodejs.jobs.build.steps.push(clearVideo);
    }

    const yml = `${rootDir}/${name}/.github/workflows/nodejs.yml`;
    if (await hasPath(yml)) {
      await clear(yml);
    }

    const dir = `${rootDir}/${name}/.github/workflows`;
    if (!(await hasPath(dir))) {
      await createPath(dir);
    }

    const yamlStr = safeDump(nodejs);
    logger.info(`Generates: ${yml}`);
    await write(yml, yamlStr, "utf8");
  } catch (error) {
    logger.error(`Workflow: ${rootDir}/${name}/package.json ${error}`);
  }
}

export default workflow;
