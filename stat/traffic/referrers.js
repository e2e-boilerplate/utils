import table from "markdown-table";
import { readdirSync, readFileSync } from "fs";
import { logger } from "../../src/constants";
import { write } from "../../src/exec";
import { bubbleSort } from "../../src/common";

function getData(file) {
  const data = readFileSync(`./stat/traffic/referrers/${file}`);
  return JSON.parse(data);
}

function getCount(stat) {
  let count = 0;
  stat.forEach((c) => {
    count += c.count;
  });
  return count;
}

function getUniques(temp) {
  let count = 0;
  temp.forEach((t) => {
    count += t.uniques;
  });
  return count;
}

function getReferrers(stat) {
  const refs = [];
  stat.sort();
  stat.forEach((ref) => {
    refs.push(ref.referrer);
  });
  return refs.join(", ");
}

function referrers() {
  const files = readdirSync(`./stat/traffic/referrers/`);
  const stat = [];

  files.forEach((file) => {
    const row = [];
    const data = getData(file);

    row.push(getCount(data));
    row.push(getUniques(data));
    row.push(getReferrers(data));
    const lastIndex = file.lastIndexOf(".");
    const name = file.substring(0, lastIndex);
    row.push(name);

    stat.push(row);
  });

  const content = bubbleSort(stat);
  content.unshift(["count", "unique", "referrers", "repository"]);

  try {
    write("docs/referrers.md", table(content, { align: "l" }), "utf8");
  } catch (error) {
    logger.error(`${__filename}: Referrers doc: ${error}`);
  }
}

export default referrers;
