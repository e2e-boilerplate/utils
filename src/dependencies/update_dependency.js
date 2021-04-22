/* eslint-disable no-restricted-syntax */
import { readFileSync, writeFileSync } from "fs";
import * as util from "util";
import compareVersions from "compare-versions";
import { logger, miscRepos, rootDir } from "../common/constants";
import { sortObject } from "../common";

const exec = util.promisify(require("child_process").exec);

/**
 * compare version
 * @param first version from package
 * @param second version from constant
 * @param name: mpm module name
 * @returns {*}
 */
function version(first, second, name) {
  if (first) {
    if (compareVersions.compare(first, second, ">")) {
      logger.info(`Changed ${name} version to ${first}`);
      return first;
    }
  }
  return undefined;
}

async function getGithubChromeDriverVersion() {
  let driverVersion;
  try {
    const { error, stdout, stderr } = await exec("chromedriver --version", { rootDir });
    if (error) {
      logger.info(stderr);
      throw error;
    }
    // eslint-disable-next-line prefer-destructuring
    driverVersion = stdout.split(" ")[1];
    logger.info(stdout);
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }

  return driverVersion;
}

/**
 * Given the dependencies and devDependencies of each repository
 * Write updated version to dependencies.json
 * @param name: repository name
 */
async function updateDependency(name) {
  try {
    const deps = JSON.parse(readFileSync("src/dependencies/dependencies.json", "utf8"));
    deps.chromedriver = await getGithubChromeDriverVersion();

    if (!miscRepos.includes(name)) {
      const data = readFileSync(`${rootDir}/${name}/package.json`);
      const pkgJson = JSON.parse(data);
      const { dependencies, devDependencies } = pkgJson;

      for (const dependency in dependencies) {
        if (Object.prototype.hasOwnProperty.call(dependencies, dependency)) {
          const newVersion = version(dependencies[dependency], deps[dependency], dependency);
          if (newVersion) {
            deps[dependency] = newVersion;
          }
        }
      }

      for (const dependency in devDependencies) {
        if (Object.prototype.hasOwnProperty.call(devDependencies, dependency)) {
          const newVersion = version(devDependencies[dependency], deps[dependency], dependency);
          if (newVersion) {
            deps[dependency] = newVersion;
          }
        }
      }

      const content = JSON.stringify(sortObject(deps), null, 2);
      writeFileSync(`src/dependencies/dependencies.json`, content);
      writeFileSync(`api/v1/dependencies.json`, content);
      writeFileSync(`${rootDir}/api/api/v1/dependencies/index.json`, content);
      logger.info(`\nUpdate dependencies.json version using \n${name}`);
    }
  } catch (error) {
    logger.error(`\nGenerate dependency, \n${error}: \n${__filename}`);
  }
}

export default updateDependency;
