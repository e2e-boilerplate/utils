import table from "markdown-table";
import combs from "./combs";
import { getFilteredRepos, updateGist } from "./common";
import { removeDuplicates } from "../../common";
import { implementedOnlyHome } from "../matrix/common";
import { logger } from "../../common/constants";

function update() {
  try {
    combs.forEach((comb) => {
      const parts = comb.split("-");
      const list = getFilteredRepos(...parts);
      const statusBadge = implementedOnlyHome(removeDuplicates(list));
      const content = table(statusBadge, { align: "l" });
      updateGist(content, `${comb}.md`);
    });
  } catch (error) {
    logger.error(`${__filename}: ${error}`);
  }
}

export default update;
