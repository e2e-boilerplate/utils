import { getFrameworkName } from "./common";
import { logger } from "./constants";

function readme(repo) {
  const { name } = repo;
  const frameworkName = getFrameworkName(name);
  logger.info(frameworkName);
}

export default readme;
