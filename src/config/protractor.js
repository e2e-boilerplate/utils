/* eslint-disable */
import { writeFileSync } from "fs";
import { rootDir, logger } from "../common/constants";

export default function protractorConfig(name) {
  const directConnect = `const directConnect = true;`;
  const mocha = `const framework = "mocha";`;
  const jasmine = `const framework = "jasmine";`;
  const mochaOp = `const mochaOpts = {
  reporter: "dot",
  timeout: 50000,
};`;
  const noMochaOp = `const mochaOpts = {};`;
  const tsNode = `const onPrepare = () => {
  browser.waitForAngularEnabled(false);
  require("ts-node").register({
    project: require("path").join(__dirname, "./tsconfig.json")
  });
};`;
  const babel = `const onPrepare = () => {
  browser.waitForAngularEnabled(false);
  /* eslint-disable-next-line global-require */
  require("@babel/register");
};`;
  const esm = `const onPrepare = () => {
  browser.waitForAngularEnabled(false);
  /* eslint-disable-next-line global-require */
  require("esm");
};`;
  const prepare = `const onPrepare = () => {
  browser.waitForAngularEnabled(false);
};`;

  try {
    const parts = name.split("-");
    if (parts.includes("protractor")) {
      const onPrepare =
        parts.includes("ts") && parts.includes("node")
          ? tsNode
          : parts.includes("babel")
          ? babel
          : parts.includes("esm")
          ? esm
          : prepare;

      const framework = parts.includes("mocha") ? mocha : jasmine;
      const mochaOpts = parts.includes("mocha") ? mochaOp : noMochaOp;
      const specs = parts.includes("typescript")
        ? `const specs = ["spec/*.spec.{js,ts}"];`
        : `const specs = ["spec/*.spec.js"];`;

      const start =
        parts.includes("typescript") && parts.includes("tsc") ? `import { browser, Config } from "protractor";` : "";

      const end =
        parts.includes("typescript") && parts.includes("tsc")
          ? `const config: Config = process.env.GITHUB_ACTIONS ? headless : headed;  
            
export { config };
`
          : `const config = process.env.GITHUB_ACTIONS ? headless : headed;    
           
exports.config = config;
`;

      const data = `${start}
      
${directConnect}
${specs}
${framework}

${mochaOpts}

${onPrepare}

const headed = {
  directConnect,
  specs,
  capabilities: {
    browserName: "chrome",
  },
  framework,
  mochaOpts,
  onPrepare
};

const headless = {
  directConnect,
  specs,
  capabilities: {
    browserName: "chrome",
      chromeOptions: {
        args: ["--headless", "--no-sandbox", "--disable-gpu"],
      },
  },
  framework,
  mochaOpts,
  onPrepare
};

${end}`;

      const configPath =
        parts.includes("typescript") && parts.includes("tsc")
          ? `${rootDir}/${name}/protractor.conf.ts`
          : `${rootDir}/${name}/protractor.conf.js`;
      writeFileSync(configPath, data, "utf8");
      logger.info(`protractor.conf.js ${name}`);
    }
  } catch (error) {
    logger.error(`${__filename}: protractor.conf.js ${error}`);
  }
}
