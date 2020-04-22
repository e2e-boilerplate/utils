import table from "markdown-table";
import { getRepos, writeGist } from "../common";
import { removeDuplicates } from "../../../common";
import { implementedOnly } from "../../common";

async function playwrightCommonjs() {
  const list = await getRepos("playwright", "commonjs");
  console.log(`....`, list);
  const statusBadge = implementedOnly(removeDuplicates(list));
  const content = table(statusBadge, { align: "l" });
  await writeGist(content, "playwright-commonjs.md");
}

export default playwrightCommonjs;
