import table from "markdown-table";
import { getRepos, updateGist } from "../common";
import { removeDuplicates } from "../../../common";
import { implementedOnlyHome } from "../../common";
import combs from "./combs";
import { logger } from "../../../constants";

function updatePlaywright() {
  try {
    combs.forEach((comb) => {
      const parts = comb.split("-");
      const list = getRepos(...parts);
      const statusBadge = implementedOnlyHome(removeDuplicates(list));
      const content = table(statusBadge, { align: "l" });
      updateGist(content, `${comb}.md`);
    });
  } catch (error) {
    logger.error(error);
  }
}

export default updatePlaywright;
