const fs = require("fs");
const { rootDir, keywords } = require("minimist")(process.argv.slice(2));

const repoName = "abcd-xyz-1234-bbbbb";

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
  let keysFromArgs = [];
  if (keywords) {
    keysFromArgs = keywords.toLowerCase().split("-");
  }
  return keysFromRepoName.concat(keysFromArgs).sort();
}

function updateMeta(repo) {
  const { name } = repo.name;

  fs.readFile(`${rootDir}/${name}/package.json`, "utf8", (err, jsonString) => {
    if (err) {
      // console.log("File read failed:", err);
      return;
    }

    try {
      // sort at the end
      const pkgJson = JSON.parse(jsonString);
      const newKeywords = buildKeywords(repoName);
      pkgJson.keywords = newKeywords;
      pkgJson.name = repoName;

      // console.log(sortObject(pkgJson));

      const j = JSON.stringify(sortObject(pkgJson));
      fs.writeFile(`${rootDir}/${name}/package.json`, j, error => {
        if (error) {
          // console.log("Error writing file", err);
        } else {
          // console.log("Successfully wrote file");
        }
      });
    } catch (error) {
      // console.log(error);
    }
  });
}

module.exports = updateMeta;
