import updatePlaywright from "./playwright/update";

async function updateGist() {
  await updatePlaywright();
}

// eslint-disable-next-line no-unused-vars
updateGist().then((r) => {});

export default updateGist;
