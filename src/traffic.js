import getRepoTrafficClones from "./data/repo/get_traffic_clones";
import getTrafficReferrers from "./data/repo/get_traffic_referrers";
import getRepoTrafficViews from "./data/repo/get_traffic_views";

// collect traffic data from Github
function traffic(repo) {
  getRepoTrafficClones(repo);
  getTrafficReferrers(repo);
  getRepoTrafficViews(repo);
}

export default traffic;
