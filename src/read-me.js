import { readFileSync } from "fs";
import { getFrameworkName, getTech, linkTech } from "./common";
import { logger, rootDir, username, miscRepos } from "./common/constants";
import { write } from "./exec";

const mit =
  "[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)";

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
    commands.hasUpdateWebDriverProperty = {}.hasOwnProperty.call(scripts, "update:webdriver");
    commands.hasTestProperty = {}.hasOwnProperty.call(scripts, "test");
  } catch (error) {
    logger.error(`${__filename}: readme: get scripts: ${name} ${error}`);
  }

  return commands;
}

export default function readme(repo) {
  const { name } = repo;
  // no README.md update for docs repo
  if (name === "docs") {
    return;
  }
  const frameworkName = getFrameworkName(name);
  const tech = linkTech(getTech(name));
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
  const updateWebDriver = "npm run update:webdriver";
  const test = "npm run test";
  const buyMeCoffee =
    "[![Buy Me A Coffee](https://img.shields.io/badge/buy-me%20coffee-orange)](https://www.buymeacoffee.com/xgirma)";
  const more =
    "For more boilerplate click [here](https://github.com/e2e-boilerplate/utils/blob/master/docs/implemented.md)";

  const { hasBuildProperty, hasUpdateWebDriverProperty, hasTestProperty } = commands;

  let data;

  if (hasBuildProperty && hasUpdateWebDriverProperty && hasTestProperty) {
    data = `${badge} ${mit} ${buyMeCoffee}
    \n${title}
    \n${description}
    \n${subTitle}
    \n1. ${clone}
    \n2. ${cd}
    \n3. ${install}
    \n4. ${build}
    \n5. ${updateWebDriver}
    \n6. ${test}
    
    \n${more}`;
  } else if (hasUpdateWebDriverProperty && hasTestProperty) {
    data = `${badge} ${mit} ${buyMeCoffee}
    \n${title}
    \n${description}
    \n${subTitle}
    \n1. ${clone}
    \n2. ${cd}
    \n3. ${install}
    \n4. ${updateWebDriver}
    \n5. ${test}
        
    \n${more}`;
  } else if (hasBuildProperty && hasTestProperty) {
    data = `${badge} ${mit} ${buyMeCoffee}
    \n${title}
    \n${description}
    \n${subTitle}
    \n1. ${clone}
    \n2. ${cd}
    \n3. ${install}
    \n4. ${build}
    \n5. ${test}
        
    \n${more}`;
  } else if (hasTestProperty) {
    data = `${badge} ${mit} ${buyMeCoffee}
    \n${title}
    \n${description}
    \n${subTitle}
    \t1. ${clone}
    \t2. ${cd}
    \t3. ${install}
    \t4. ${test}
        
    \n${more}`;
  } else {
    data = `${badge} ${mit} ${buyMeCoffee}
    \n${title}
    \n${description}
    \n${subTitle}
    \n1. ${clone}
    \n2. ${cd}
    \n3. ${install}
        
    \n${more}`;
  }

  try {
    write(path, data, "utf8");
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }
}
