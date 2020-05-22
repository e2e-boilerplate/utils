import { readFileSync, writeFileSync } from "fs";
import generateDependency from "./dependencies/generate_dependency";
import { author, logger, miscRepos, rootDir, username } from "./common/constants";
import { buildKeywords, getFrameworkName, getTech, sortObject } from "./common";

const keywords = ["e2e", "e2e tests", "boilerplate", "integration test", "test automation", "javascript"];

const lintStagedTypescript = {
  "*.{js,ts,json,md}": ["tslint --fix", "prettier --write"], // eslint-disable-line
};

const lintStaged = {
  "*.{js,json,md}": ["eslint --fix", "prettier --write"], // eslint-disable-line
};

const husky = {
  hooks: {
    "pre-commit": "lint-staged --allow-empty", // eslint-disable-line
  }, // eslint-disable-line
};

const cypressCucumberPreprocessor = {
  nonGlobalStepDefinitions: true, // eslint-disable-line
};

function buildDescription(name) {
  const framework = getFrameworkName(name);
  const tech = getTech(name);
  return `${framework} end-to-end test automation boilerplate. ${tech}`;
}

/**
 * Given repository name builds the content of its package.json file
 * @param repo
 */
export default function buildPackageJson(name) {
  try {
    if (!miscRepos.includes(name)) {
      const data = readFileSync(`${rootDir}/${name}/package.json`);
      const pkgJson = JSON.parse(data);
      const script = pkgJson.scripts;
      const path = `${rootDir}/${name}/package.json`;
      const parts = name.split("-");

      pkgJson.keywords = buildKeywords(name);
      pkgJson.keywords.push(...keywords);
      pkgJson.description = buildDescription(name);
      pkgJson.name = name;
      pkgJson.homepage = `https://github.com/${username}/${name}#readme`;
      pkgJson.repository = {
        type: "git",
        url: `git+https://github.com/${username}/${name}.git`,
      };
      pkgJson.bugs = {
        url: `https://github.com/${username}/${name}/issues`,
      };
      pkgJson.author = author || "";
      pkgJson.scripts = sortObject(script);
      if (pkgJson.main) {
        delete pkgJson.main;
      }

      pkgJson.license = "MIT";
      pkgJson.husky = husky;

      if (!parts.includes("typescript")) {
        pkgJson["lint-staged"] = lintStaged;
      } else {
        pkgJson["lint-staged"] = lintStagedTypescript;
      }

      if (parts.includes("cypress") && parts.includes("cucumber")) {
        pkgJson["cypress-cucumber-preprocessor"] = cypressCucumberPreprocessor;
      }

      if (!miscRepos.includes(name)) {
        const { dep: dependencies, devDep: devDependencies } = generateDependency(name);
        pkgJson.dependencies = sortObject(dependencies);
        pkgJson.devDependencies = sortObject(devDependencies);
      }

      const update = JSON.stringify(sortObject(pkgJson), null, 2);
      writeFileSync(path, update, "utf8");
      logger.info(`\nGenerates package.json for \n${name}`);
    }
  } catch (error) {
    logger.error(`\n${name} \n${error} \n${__filename}`);
  }
}
