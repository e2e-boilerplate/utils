import table from "markdown-table";
import { readdirSync, readFileSync } from "fs";
import { actionsStatusHome } from "../../src/docs/matrix/common";
import { logger, rootDir } from "../../src/common/constants";
import { bubbleSort } from "../../src/common";
import { write } from "../../src/exec";

function getData(file, type) {
  const data = readFileSync(`${rootDir}/docs/traffic/data/${type}/${file}`);
  return JSON.parse(data);
}

/**
 * Write traffic doc for views and clones
 * @param type: views, clones
 */
function writeTrafficDoc(type) {
  const files = readdirSync(`${rootDir}/docs/traffic/data/${type}/`);
  const stat = [];

  files.forEach((file) => {
    const row = [];
    const lastIndex = file.lastIndexOf(".");
    const name = file.substring(0, lastIndex);
    const data = getData(file, type);

    row.push(data.count);
    row.push(data.uniques);
    row.push(actionsStatusHome(name));
    stat.push(row);
  });

  const content = bubbleSort(stat);
  content.unshift([`${type} count`, `unique ${type}`, "repository"]);

  try {
    write(`${rootDir}/docs/traffic/${type}.md`, table(content, { align: "l" }), "utf8");
  } catch (error) {
    logger.error(`${__filename}: Clones doc: ${error}`);
  }
}

export default writeTrafficDoc;
