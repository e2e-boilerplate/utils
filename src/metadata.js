const fs = require("fs");
const { logger, keywords, rootDir, author } = require("./constants");

function sortObject(obj) {
  const keys = Object.keys(obj).sort();
  const newObj = {};
  keys.forEach(key => {
    newObj[key] = obj[key];
  });
  return newObj;
}

function buildKeywords(name) {
  const keysFromRepoName = name.toLowerCase().split("-");

  if (keysFromRepoName.includes("ts" && "node")) {
    keysFromRepoName.push("ts-node");
  }
  if (keysFromRepoName.includes("selenium" && "webdriver")) {
    keysFromRepoName.push("selenium-webdriver");
  }

  const keys = keysFromRepoName.filter(word => word !== "modules" && word !== "ts" && word !== "node");
  let keysFromArgs = [];
  if (keywords) {
    keysFromArgs = keywords.toLowerCase().split("-");
  }
  return keys.concat(keysFromArgs).sort();
}

async function writeChanges(name, data) {
  try {
    fs.writeFileSync(`${rootDir}/${name}/package.json`, data);
    logger.info(`Update metadata for ${name}`);
  } catch (error) {
    logger.error(error);
  }
}

async function updateMeta(repo) {
  const { name } = repo;

  try {
    const data = fs.readFileSync(`${rootDir}/${name}/package.json`);
    const pkgJson = JSON.parse(data);

    pkgJson.keywords = buildKeywords(name);
    pkgJson.name = name;
    pkgJson.repository = {
      type: "git",
      url: `git+https://github.com/e2e-boilerplates/${name}.git`
    };
    pkgJson.author = author || "";

    await writeChanges(name, JSON.stringify(sortObject(pkgJson)));
  } catch (error) {
    logger.error(error);
  }
}

module.exports = {
  updateMeta
};
