import { readFileSync } from "fs";
import { getFrameworkName, getTech } from "./common";
import { logger, rootDir, username, miscRepos } from "./constants";
import { write } from "./exec";

function actionsStatus(repo) {
  const { name } = repo;
  return `[![GitHub Actions status | ${username}/${name}](https://github.com/${username}/${name}/workflows/${name}/badge.svg)](https://github.com/${username}/${name}/actions?workflow=${name})`;
}

function getScriptsCombo(repo) {
  const { name } = repo;
  const commands = {};

  try {
    const data = readFileSync(`${rootDir}/${name}/package.json`);
    const pkgJson = JSON.parse(data);
    const { scripts } = pkgJson;
    commands.hasBuildProperty = {}.hasOwnProperty.call(scripts, "build");
    commands.hasUpdateWebDriverProperty = {}.hasOwnProperty.call(scripts, "update-webdriver");
    commands.hasTestProperty = {}.hasOwnProperty.call(scripts, "test");
  } catch (error) {
    logger.error(`readme: get scripts: ${name} ${error}`);
  }

  return commands;
}

async function readme(repo) {
  const { name } = repo;
  const frameworkName = getFrameworkName(name);
  const tech = getTech(name);
  const commands = getScriptsCombo(repo);
  const path = `${rootDir}/${name}/README.md`;
  const badge = `${actionsStatus(repo)}`;
  const title = miscRepos.includes(name) ? `# ${frameworkName}` : `# ${frameworkName} Boilerplate`;
  const description = miscRepos.includes(name)
    ? `${name}.`
    : `${frameworkName} end-to-end test automation boilerplate, ${tech}`;
  const subTitle = "## Getting Started";
  const clone = `git clone git@github.com:${username}/${name}.git`;
  const cd = `cd ${name}`;
  const install = `npm install`;
  const build = "npm run build";
  const updateWebDriver = "npm run update-webdriver";
  const test = "npm run test";

  const { hasBuildProperty, hasUpdateWebDriverProperty, hasTestProperty } = commands;

  let data;

  if (hasBuildProperty && hasUpdateWebDriverProperty && hasTestProperty) {
    data = `${badge}
    \n${title}
    \n${description}
    \n${subTitle}
    \n${clone}
    \n${cd}
    \n${install}
    \n${build}
    \n${updateWebDriver}
    \n${test}`;
  } else if (hasUpdateWebDriverProperty && hasTestProperty) {
    data = `${badge}
    \n${title}
    \n${description}
    \n${subTitle}
    \n${clone}
    \n${cd}
    \n${install}
    \n${updateWebDriver}
    \n${test}`;
  } else if (hasBuildProperty && hasTestProperty) {
    data = `${badge}
    \n${title}
    \n${description}
    \n${subTitle}
    \n${clone}
    \n${cd}
    \n${install}
    \n${build}
    \n${test}`;
  } else if (hasTestProperty) {
    data = `${badge}
    \n${title}
    \n${description}
    \n${subTitle}
    \t${clone}
    \t${cd}
    \t${install}
    \t${test}`;
  } else {
    data = `${badge}
    \n${title}
    \n${description}
    \n${subTitle}
    \n${clone}
    \n${cd}
    \n${install}`;
  }

  try {
    await write(path, data, "utf8");
  } catch (error) {
    logger.error(error);
  }
}

export default readme;
