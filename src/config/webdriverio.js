/*eslint-disable */
import { rootDir, logger } from "../common/constants";
import { write } from "../exec";

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
  const mochaOp = `mochaOpts: {
    timeout: 60000,
  }`;
  const noMochaOp = `mochaOpts: {}`;

  try {
    const parts = name.split("-");

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

      let before = parts.includes("babel")
        ? `// eslint-disable-next-line no-unused-vars
  before: (capabilities, specs) => {
    // eslint-disable-next-line import/no-extraneous-dependencies, global-require
    require("@babel/register");
  }`
        : parts.includes("ts") && parts.includes("node")
        ? `// eslint-disable-next-line no-unused-vars
  before: (capabilities, specs) => {
    // eslint-disable-next-line global-require
    require("ts-node").register({ files: true });
  }`
        : `// eslint-disable-next-line no-unused-vars
  before: (capabilities, specs) => {}`;

      const data = `const headed = {
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
  ${before},
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
  ${before},
};

const config = process.env.GITHUB_ACTIONS ? headless : headed;

exports.config = config;
`;
      /* eslint-enable */
      const configPath = `${rootDir}/${name}/wdio.conf.js`;
      write(configPath, data, "utf8");
      logger.info(`.wdio.conf.js ${name}`);
    }
  } catch (error) {
    logger.error(`${__filename}: .wdio.conf.js ${error}`);
  }
}
