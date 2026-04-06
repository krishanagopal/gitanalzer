import githubClient from "../config/github.js";
import { analyzeRepos } from "../utils/repoAnalyzer.js";
import { analyzeActivity } from "../utils/activityAnalyzer.js";
import { calculateDevScore } from "../utils/scoreCalculator.js";
export const fetchGithubData = async (username) => {

    const [userResponse, reposResponse, eventsResponse] = await Promise.all([
        githubClient.get(`/users/${username}`),
        githubClient.get(`/users/${username}/repos?per_page=100`),
        githubClient.get(`/users/${username}/events?per_page=100`)
    ]);

    const repoStats = analyzeRepos(reposResponse.data);
    const activityStats = analyzeActivity(eventsResponse.data);
    const score = calculateDevScore(repoStats, activityStats);
return {
    profile: userResponse.data,
    repoStats,
    activityStats,
    score
};

};