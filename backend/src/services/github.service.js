import githubClient from "../config/github.js";
import { analyzeRepos } from "../utils/repoAnalyzer.js";
import { analyzeActivity } from "../utils/activityAnalyzer.js";
import { calculateDevScore } from "../utils/scoreCalculator.js";
import { analyzeRepoHealth } from "../utils/repoDeepAnalyzer.js";
import { analyzeCommits } from "../utils/commitAnalyzer.js";
import { analyzeBusFactor } from "../utils/busFactorAnalyzer.js";
import { analyzeOwnership } from "../utils/ownershipAnalyzer.js";
import { analyzeProsCons } from "../utils/prosConsAnalyzer.js";

const generateHeuristicSummary = (profile, repoStats, commitStats) => {
    const primaryLanguage = repoStats.languages.length > 0 ? repoStats.languages[0] : 'various technologies';
    
    // Determine developer persona
    const { feat, fix, docs } = commitStats.typeDistribution || {};
    let persona = "a balanced contributor";
    if (feat > fix && feat > docs) persona = "a feature-driven developer";
    if (fix > feat && fix > docs) persona = "a highly active maintainer focusing on bug fixes";
    if (docs > feat && docs > fix) persona = "a detail-oriented developer with exceptional documentation habits";

    // Streak and active profile
    let activityNote = "with steady recent activity.";
    if (commitStats.currentStreak > 7) {
        activityNote = `currently on an impressive ${commitStats.currentStreak}-day coding streak.`;
    } else if (commitStats.longestStreak > 14) {
        activityNote = `capable of remarkable consistency with a record ${commitStats.longestStreak}-day coding streak.`;
    } else if (commitStats.timeOfDay?.night > commitStats.timeOfDay?.morning) {
        activityNote = "often productive during late night hours.";
    }

    let projectNote = "";
    if (repoStats.topProjects && repoStats.topProjects.length > 0) {
        const topNames = repoStats.topProjects.map(p => p.name).join(' and ');
        projectNote = ` They demonstrate these skills primarily in projects like ${topNames}.`;
    }

    const name = profile.name || profile.login;
    return `${name} is ${persona} primarily working in ${primaryLanguage}.${projectNote} They demonstrate a ${repoStats.documentationScore || 0}% documentation rate across active repositories, ${activityNote}`;
};

export const fetchGithubData = async (username) => {
    const [userResponse, reposResponse, eventsResponse] = await Promise.all([
        githubClient.get(`/users/${username}`),
        githubClient.get(`/users/${username}/repos?per_page=100`),
        githubClient.get(`/users/${username}/events?per_page=100`)
    ]);

    const repoStats = analyzeRepos(reposResponse.data);
    const activityStats = analyzeActivity(eventsResponse.data, username);

    const [
        healthStats,
        commitStats,
        busFactorStats,
        ownershipStats
    ] = await Promise.all([
        analyzeRepoHealth(reposResponse.data, githubClient),
        analyzeCommits(reposResponse.data, githubClient),
        analyzeBusFactor(reposResponse.data, githubClient),
        analyzeOwnership(reposResponse.data, githubClient, username)
    ]);
    
    const score = calculateDevScore(repoStats, activityStats, commitStats);
    
    const enhancedRepoStats = { 
        ...repoStats, 
        undocumentedRepos: healthStats.undocumentedRepos,
        reposWithoutLicense: healthStats.reposWithoutLicense,
        documentationScore: healthStats.documentationScore,
        architectureScore: healthStats.architectureScore,
        readmeQualityScore: healthStats.readmeQualityScore,
        testingScore: healthStats.testingScore,
        deploymentScore: healthStats.deploymentScore,
        flatStructureRepos: healthStats.flatStructureRepos,
        poorDocsRepos: healthStats.poorDocsRepos,
        workflowStats: healthStats.workflowStats,
        profileBrandingScore: healthStats.profileBrandingScore,
        hasProfileReadme: healthStats.hasProfileReadme
    };
    
    const aiSummary = generateHeuristicSummary(userResponse.data, enhancedRepoStats, commitStats);
    
    // Inject advanced health metrics into repoStats for prosConsAnalyzer
    const recruiterSignals = analyzeProsCons(
        enhancedRepoStats, 
        activityStats, 
        commitStats, 
        { cicdRepos: healthStats.cicdRepos }, 
        reposResponse.data
    );

    return {
        profile: userResponse.data,
        repoStats: enhancedRepoStats,
        activityStats,
        score,
        aiSummary,
        cicdStats: { cicdRepos: healthStats.cicdRepos },
        commitStats,
        busFactorStats,
        ownershipStats,
        recruiterSignals
    };
};