import { readFileSync } from "fs";
import { getFrameworkName, getTech } from "./common";
import { logger, rootDir, username, miscRepos } from "./constants";
import { write } from "./exec";

function actionsStatus(repo) {
  const { name } = repo;
  return `[![GitHub Actions status | ${username}/${name}](https://github.com/${username}/${name}/workflows/${name}/badge.svg)](https://github.com/${username}/${name}/actions?workflow=${name})`;
}

function getScripts(repo) {
  const { name } = repo;
  const commands = [];

  try {
    const data = readFileSync(`${rootDir}/${name}/package.json`);
    const pkgJson = JSON.parse(data);
    const { scripts } = pkgJson;

    const hasBuildProperty = {}.hasOwnProperty.call(scripts, "build");
    const hasUpdateWebDriverProperty = {}.hasOwnProperty.call(scripts, "update-webdriver");
    const hasTestProperty = {}.hasOwnProperty.call(scripts, "test");

    commands.push(`git clone git@github.com:${username}/${name}.git`);
    commands.push(`cd ${name}`);
    commands.push(`npm install`);

    if (hasBuildProperty) {
      commands.push("npm run build");
    }
    if (hasUpdateWebDriverProperty) {
      commands.push("npm run update-webdriver");
    }
    if (hasTestProperty) {
      commands.push("npm run test");
    }
  } catch (error) {
    logger.error(`readme: get scripts: ${name} ${error}`);
  }

  return commands;
}

async function readme(repo) {
  const { name } = repo;
  const frameworkName = getFrameworkName(name);
  const tech = getTech(name);
  const commands = getScripts(repo);
  const path = `${rootDir}/${name}/README.md`;

  const badge = `${actionsStatus(repo)}`;
  const title = `# ${frameworkName} Boilerplate`;
  const description = miscRepos.includes(name)
    ? `${name}.`
    : `${frameworkName} end-to-end test automation boilerplate, ${tech}`;
  const subTitle = "## Getting Started";
  let steps = "";
  commands.forEach(command => {
    steps += `\t ${command} \n`;
  });

  const data = `${badge}
  ${title}
  ${description}
  ${subTitle}
  ${steps}`;

  try {
    await write(path, data, "utf8");
  } catch (error) {
    logger.error(error);
  }
}

export default readme;
