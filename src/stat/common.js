import table from "markdown-table";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { actionsStatusHome } from "../docs/matrix/common";
import { bubbleSort } from "../common";
import { logger, rootDir } from "../common/constants";

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
    const path = `${rootDir}/docs/traffic/${type}.md`;
    writeFileSync(path, table(content, { align: "l" }), "utf8");
    logger.info(`Write ${path}`);
  } catch (error) {
    logger.error(`${__filename}: Clones doc: ${error}`);
  }
}

export default writeTrafficDoc;
