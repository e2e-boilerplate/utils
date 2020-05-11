import { readdirSync, writeFileSync } from "fs";
import { logger, reposDir, miscRepos } from "./constants";

function reposArray() {
  const list = [];
  const path = `./src/docs/repos.json`;

  try {
    const files = readdirSync(reposDir);

    for (let i = 1; i < files.length; i += 1) {
      const repos = require(`../repos/repo-${i}.json`);
      repos.forEach((repo) => {
        const { name } = repo;
        if (!miscRepos.includes(name)) {
          list.push(name);
        }
      });
    }
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }

  const data = JSON.stringify(list, null, 2);
  writeFileSync(path, data, "utf8");
}

export default reposArray;
