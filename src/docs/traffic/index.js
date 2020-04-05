import clones from "./clones";
import paths from "./paths";
import referrers from "./referrers";
import views from "./views";

async function traffic(repo) {
  const { name } = repo;
  await clones(name);
  await paths(name);
  await referrers(name);
  await views(name);
}

export default traffic;
