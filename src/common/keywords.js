import { keywords } from "./constants";
import { getName } from "./filter";

/**
 * Given repo name, returns keywords
 * @param name
 * @returns {keywords[]}
 */
export default function buildKeywords(name) {
  const parts = name.split("-");

  const techName = getName(name);

  parts.push(`${techName} example`);

  parts.push(`${techName} boilerplate`);

  parts.push(`${techName} automation`);

  let jestCount = 0;

  parts.forEach((part) => {
    if (part === "jest") {
      jestCount += 1;
    }
  });

  const hasTwoJest = jestCount === 2;

  if (parts.includes("ts" && "node")) {
    parts.push("ts-node");
  }

  if (hasTwoJest && parts.includes("ts" && "jest")) {
    parts.push("ts-jest");
  }

  if (parts.includes("selenium", "webdriver") && !parts.includes("manager")) {
    parts.push("selenium-webdriver");
  }

  if (parts.includes("selenium", "manager") && !parts.includes("webdriver")) {
    parts.push("webdriver manager");
  }

  if (parts.includes("es", "modules")) {
    parts.push("es modules");
  }

  if (parts.includes("webdriver", "manager")) {
    parts.push("webdriver manager");
  }

  const escapeDouble = hasTwoJest
    ? ["modules", "ts", "node", "es", "webdriver", "manager", "jest"]
    : ["modules", "ts", "node", "es", "webdriver", "manager"];

  const keys = parts.filter((word) => !escapeDouble.includes(word));

  if (hasTwoJest) {
    keys.push("jest");
  }

  let keysFromArgs = [];
  if (keywords) {
    keysFromArgs = keywords.toLowerCase().split("-");
  }
  return keys.concat(keysFromArgs).sort();
}
