export const calculateDevScore = (repoStats, activityStats) => {

    const commits = activityStats.totalCommits;
    const activeMonths = activityStats.activeMonths;

    const stars = repoStats.totalStars;
    const activeRepos = repoStats.activeRepos;
    const languages = repoStats.languages.length;

    // Activity Score
    const activityScore = Math.min(commits / 500, 1) * 100;

    // Project Depth
    const projectScore = Math.min(activeRepos / 20, 1) * 100;

    // Tech Diversity
    const diversityScore = Math.min(languages / 8, 1) * 100;

    // Impact
    const impactScore = Math.min(stars / 200, 1) * 100;

    // Collaboration (placeholder for now)
    const collaborationScore = 50;

    // Consistency
    const consistencyScore = (activeMonths / 12) * 100;

    const finalScore =
        activityScore * 0.30 +
        projectScore * 0.20 +
        diversityScore * 0.15 +
        impactScore * 0.15 +
        collaborationScore * 0.10 +
        consistencyScore * 0.10;

    return Math.round(finalScore);
};