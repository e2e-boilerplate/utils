import { rootDir, logger } from "../constants";
import { write } from "../exec";

async function webdriverIoConfig(name) {
  /*eslint-disable */
  const data = `module.exports = {
  extension: ["js"],
  package: "./package.json",
  reporter: "dot",
  timeout: 50000
};`;
  /* eslint-enable */

  try {
    const parts = name.split("-");
    if (parts.includes("mocha") && !parts.includes("protractor") && !parts.includes("webdriverio")) {
      const configPath = `${rootDir}/${name}/.mocharc.js`;
      await write(configPath, data, "utf8");
      logger.info(`.mocharc.js ${name}`);
    }
  } catch (error) {
    logger.error(`${__filename}: .mocharc.js ${error}`);
  }
}

export default webdriverIoConfig;
