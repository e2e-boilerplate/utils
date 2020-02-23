const fs = require("fs");
const argv = require("minimist")(process.argv.slice(2));
const { clone, installDependencies, pull } = require("./src/task");
const { checkRepositoriesList, checkRootDir } = require("./src/checklist");
const logger = require("./src/common/logger");

const dir = "./repos";

async function runner() {
  await checkRepositoriesList();
  await checkRootDir();

  fs.readdir(dir, (error, files) => {
    if (!error) {
      for (let i = 1; i < files.length; i += 1) {
        const repos = require(`./repos/repo-${i}.json`);
        repos.forEach(repo => {
          switch (argv.task) {
            case "clone":
              clone(repo);
              break;
            case "install":
              installDependencies(repo);
              break;
            case "pull":
              pull(repo);
              break;
            default:
              logger.warn("invalid task");
          }
        });
      }
    } else {
      // TODO remove or use try catch
    }
  });
}

runner();
