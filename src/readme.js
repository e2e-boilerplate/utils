// import { getFrameworkName, getTech } from "./common";
import { logger } from "./constants";

function readme(repo) {
  const { name } = repo;
  // const frameworkName = getFrameworkName(name);
  // const tech = getTech(name);
  logger.info(name);
}

export default readme;
