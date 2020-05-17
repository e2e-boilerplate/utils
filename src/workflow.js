import { clear, createPath, getFrameworkName, hasPath, getMetaValue } from "./common";
import { logger, rootDir } from "./common/constants";
import { readFileSync } from "fs";
import { safeDump } from "js-yaml";
import { write } from "./exec";
import getRandomCron from "./common/cron";

async function setCron(name) {
  let value;
  try {
    value = await getMetaValue(name, "cron");
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }
  return value || getRandomCron();
}

async function workflow(repo) {
  const { name } = repo;
  const parts = name.split("-");
  const cron = await setCron(name);
  const nodejs = {
    name,
    on: { push: null, schedule: [{ cron }] },
    jobs: {
      build: {
        "runs-on": "ubuntu-latest",
        steps: [
          { uses: "actions/checkout@v2" },
          {
            name: "node",
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
        name: "install:linux:dep",
        run:
          "sudo apt-get update\nsudo apt-get install libwoff1 libopus0 libwebp6 libwebpdemux2 libenchant1c2a libgudev-1.0-0 libsecret-1-0 libhyphen0 libgdk-pixbuf2.0-0 libegl1 libgles2 libevent-2.1-6 libnotify4 libxslt1.1\nsudo apt-get install xvfb\n",
      };
      nodejs.jobs.build.steps.push(aptGet);
    }

    if (getFrameworkName(name) === "Puppeteer") {
      const aptGet = {
        name: "install:linux:dep",
        run: "sudo apt-get install -y libgbm-dev",
      };
      nodejs.jobs.build.steps.push(aptGet);
    }

    const installNamModules = { name: "npm:install", run: "npm install", env: { CI: true } };
    const lint = { name: "lint", run: "npm run lint --if-present" };
    const build = { name: "build", run: "npm run build --if-present" };
    nodejs.jobs.build.steps.push(installNamModules);
    nodejs.jobs.build.steps.push(lint);
    nodejs.jobs.build.steps.push(build);

    if (keys.includes("update:webdriver")) {
      const update = { name: "update:webdriver", run: "npm run update:webdriver" };
      nodejs.jobs.build.steps.push(update);

      const wait = { name: "sleep:7s", uses: "jakejarvis/wait-action@master", with: { time: "10s" } };
      nodejs.jobs.build.steps.push(wait);
    }

    if (keys.includes("start:webdriver")) {
      const start = { name: "start:webdriver", run: "npm run start:webdriver &" };
      nodejs.jobs.build.steps.push(start);

      const wait = { name: "sleep:7s", uses: "jakejarvis/wait-action@master", with: { time: "10s" } };
      nodejs.jobs.build.steps.push(wait);
    }

    // TODO run nightwatch headless with one config
    if (parts.includes("testcafe")) {
      let test;
      if (parts.includes("typescript")) {
        test = { name: "test", uses: "DevExpress/testcafe-action@latest", with: { args: "chrome spec/*.spec.ts" } };
      } else {
        test = { name: "test", uses: "DevExpress/testcafe-action@latest", with: { args: "chrome spec/*.spec.js" } };
      }
      nodejs.jobs.build.steps.push(test);
    } else if (keys.includes("test:ci")) {
      const test = { name: "test", run: "npm run test:ci" };
      nodejs.jobs.build.steps.push(test);
    } else if (keys.includes("test")) {
      if (parts.includes("cypress")) {
        const test = { name: "test", run: "npm run test -- --headless" };
        nodejs.jobs.build.steps.push(test);
      } else {
        const test = { name: "test", run: "npm run test" };
        nodejs.jobs.build.steps.push(test);
      }
    }

    if (getFrameworkName(name) === "cypress") {
      const clearVideo = {
        name: "cypress:clear:video",
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
    write(yml, yamlStr, "utf8");
  } catch (error) {
    logger.error(`${__filename}: Workflow: ${rootDir}/${name}/package.json ${error}`);
  }
}

export default workflow;
