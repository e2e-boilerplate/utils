import table from "markdown-table";
import { getRepos, writeGist } from "../common";
import { removeDuplicates } from "../../../common";
import { implementedOnly, implementedOnlyWo } from "../../common";
import { logger, options, reposDir, username } from "../../../constants";

async function playwrightCommonjs() {
  const list = await getRepos("playwright", "commonjs");
  console.log(`....`, list);
  const statusBadge = implementedOnlyWo(removeDuplicates(list));
  logger.warn(statusBadge);
  const content = table(statusBadge, { align: "l" });
  logger.warn(content);
  await writeGist(content, "playwright-commonjs.md");
}

export default playwrightCommonjs;
