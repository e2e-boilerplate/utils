const fs = require("fs");
const argv = require("minimist")(process.argv.slice(2));
const { clone, install, pull } = require("./task");
const logger = require("./logger");

const dir = "./repos";

async function runner() {
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
              install(repo);
              break;
            case "pull":
              pull(repo);
              break;
            default:
              logger.info("invalid task");
          }
        });
      }
    }
  });
}

runner();
