/* eslint-disable no-param-reassign */
import table from "markdown-table";
import { readdirSync, readFileSync } from "fs";
import { logger } from "../src/constants";
import { write } from "../src/exec";

function getData(file) {
  const data = readFileSync(`./stat/traffic/${file}`);
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

const bubbleSort = (inputArr) => {
  const len = inputArr.length;
  let swapped;
  do {
    swapped = false;
    for (let i = 0; i < len - 1; i += 1) {
      if (inputArr[i][0] < inputArr[i + 1][0]) {
        const tmp = inputArr[i];
        inputArr[i] = inputArr[i + 1];
        inputArr[i + 1] = tmp;
        swapped = true;
      }
    }
  } while (swapped);
  return inputArr;
};

function traffic() {
  const files = readdirSync(`./stat/traffic/`);
  const stat = [];

  files.forEach((file) => {
    const row = [];
    const data = getData(file);

    row.push(getCount(data));
    row.push(getUniques(data));
    row.push(getReferrers(data));
    row.push(file);

    stat.push(row);
  });

  const content = bubbleSort(stat);
  content.unshift(["count", "unique", "referrers", "repository"]);

  try {
    write("src/docs/trafic.md", table(content, { align: "l" }), "utf8");
  } catch (error) {
    logger.error(`${__filename}: Referrers doc: ${error}`);
  }
}

export default traffic;
