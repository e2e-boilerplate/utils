import { getGistId, getRepos } from "..";
import { actionsStatus, removeDuplicates, username } from "../../../common";

import { implementedOnly } from "../../common";
import { write } from "../../../exec";
import table from "markdown-table";

async function playwrightCommonjs() {
  const id = getGistId();
  const list = getRepos("playwright", "commonjs");
  const statusBadge = implementedOnly(removeDuplicates(list));
  const content = table(statusBadge, { align: "l" });
}
