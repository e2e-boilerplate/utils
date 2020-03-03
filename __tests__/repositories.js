/* eslint no-unused-vars: 0, no-empty-pattern:0, no-param-reassign: 0 */
import { request } from "https";
import { writeFileSync } from "fs";
import { hasRepositoriesList, isNumeric } from "../src/validators";
import getRepositories from "../src/repositories";
import { clearRepositoriesList } from "../src/exec";
import { username, pages, logger } from "../src/constants";

// jest.mock("writeFileSync", () => ({}));
jest.mock("request", () => ({
  end: jest.fn(({}, response) => response())
}));

jest.mock("../src/constants", () => ({
  __esModule: true,
  username: "xgirma",
  pages: "1",
  logger: jest.fn(() => {})
}));
jest.mock("../src/validators", () => ({
  __esModule: true,
  hasRepositoriesList: jest.fn(() => true),
  isNumeric: jest.fn(() => true)
}));
jest.mock("../src/exec", () => ({
  __esModule: true,
  clearRepositoriesList: jest.fn(() => {})
}));

describe("repositories", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should clear repositories", async () => {
    await getRepositories();
    expect(hasRepositoriesList).toHaveBeenCalledTimes(1);
    expect(clearRepositoriesList).toHaveBeenCalledTimes(1);
    expect(isNumeric).toHaveBeenCalledWith("1");
    expect(isNumeric).toHaveBeenCalledTimes(1);
  });

  it("should clear repositories", async () => {
    hasRepositoriesList.mockReturnValue(false);
    await getRepositories();
    expect(hasRepositoriesList).toHaveBeenCalledTimes(1);
    expect(clearRepositoriesList).toHaveBeenCalledTimes(0);
    expect(isNumeric).toHaveBeenCalledWith("1");
  });
});
