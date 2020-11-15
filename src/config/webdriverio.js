/*eslint-disable */
import { writeFileSync } from "fs";
import { rootDir, logger } from "../common/constants";

export default function wdioConfig(name) {
  const runner = `runner: "local"`;
  const path = `path: "/"`;
  const services = `services: ["chromedriver"]`;
  const logLevel = `logLevel: "silent"`;
  const reporters = `reporters: ["dot"]`;
  const cucumberOp = `cucumberOpts: {
    require: ["./features/step_definitions/stepdefs.js"],
    timeout: 60000,
  }`;
  const noCucumberOp = `cucumberOpts: {}`;
  const jasmineNodeOp = `jasmineNodeOpts: {
    defaultTimeoutInterval: 60000,
  }`;
  const noJasmineNodeOp = `jasmineNodeOpts: {}`;
  let mochaOp = `mochaOpts: {
    timeout: 60000,
  }`;
  const noMochaOp = `mochaOpts: {}`;

  try {
    const parts = name.split("-");

    if(parts.includes("mocha") && parts.includes("babel")) {
      mochaOp = `mochaOpts: {
    timeout: 60000,
    require: ["@babel/register"],
  }`
    }

    if (parts.includes("webdriverio")) {
      let specs = parts.includes("cucumber")
        ? `specs: ["./features/*.feature"]`
        : parts.includes("typescript")
        ? `specs: ["./spec/*.spec.ts"]`
        : `specs: ["./spec/*.spec.js"]`;

      let framework = parts.includes("cucumber")
        ? `framework: "cucumber"`
        : parts.includes("jasmine")
        ? `framework: "jasmine"`
        : `framework: "mocha"`;

      const mochaOpts = parts.includes("mocha") ? mochaOp : noMochaOp;
      const jasmineNodeOpts = parts.includes("jasmine") ? jasmineNodeOp : noJasmineNodeOp;
      const cucumberOpts = parts.includes("cucumber") ? cucumberOp : noCucumberOp;

      let pre = parts.includes("ts") && parts.includes("node")
        ? `require("ts-node").register({ files: true });` : ``;

      const data = `${pre}
const headed = {
  ${runner},
  ${path},
  ${specs},
  capabilities: [
    {
      browserName: "chrome",
    },
  ],
  ${logLevel},
  ${services},
  ${framework},
  ${reporters},
  ${mochaOpts},
  ${jasmineNodeOpts},
  ${cucumberOpts},
};

const headless = {
  ${runner},
  ${path},
  ${specs},
  capabilities: [
    {
      browserName: "chrome",
      "goog:chromeOptions": {
        args: ["--headless", "--disable-gpu"]
      },
    },
  ],
  ${logLevel},
  ${services},
  ${framework},
  ${reporters},
  ${mochaOpts},
  ${jasmineNodeOpts},
  ${cucumberOpts},
};

const config = process.env.GITHUB_ACTIONS ? headless : headed;

exports.config = config;
`;
      /* eslint-enable */
      const configPath = `${rootDir}/${name}/wdio.conf.js`;
      writeFileSync(configPath, data, "utf8");
      logger.info(`.wdio.conf.js ${name}`);
    }
  } catch (error) {
    logger.error(`${__filename}: .wdio.conf.js ${error}`);
  }
}
