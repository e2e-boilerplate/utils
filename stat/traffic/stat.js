import table from "markdown-table";
import { readdirSync, readFileSync } from "fs";
import { logger } from "../../src/constants";
import { bubbleSort } from "../../src/common";
import { write } from "../../src/exec";

function getData(file, type) {
  const data = readFileSync(`./stat/traffic/${type}/${file}`);
  return JSON.parse(data);
}

function trafficStat(type) {
  const files = readdirSync(`./stat/traffic/${type}/`);
  const stat = [];

  files.forEach((file) => {
    const row = [];
    const lastIndex = file.lastIndexOf(".");
    const name = file.substring(0, lastIndex);
    const data = getData(file, type);

    row.push(data.count);
    row.push(data.uniques);
    row.push(name);
    stat.push(row);
  });

  const content = bubbleSort(stat);
  content.unshift([`${type} count`, `unique ${type}`, "repository"]);

  try {
    write(`docs/${type}.md`, table(content, { align: "l" }), "utf8");
  } catch (error) {
    logger.error(`${__filename}: Clones doc: ${error}`);
  }
}

export default trafficStat;
