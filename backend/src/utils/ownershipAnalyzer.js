export const analyzeOwnership = async (repos, githubClient, username) => {

    let totalOwnership = 0;
    let analyzedRepos = 0;

    let teamProjects = 0;
    let dominantProjects = 0;

    for (const repo of repos) {

        try {

            const res = await githubClient.get(
                `/repos/${repo.owner.login}/${repo.name}/contributors?per_page=10`
            );

            const contributors = res.data || [];

            const totalCommits = contributors.reduce(
                (sum, c) => sum + c.contributions,
                0
            );

            const userContributor = contributors.find(
                c => c.login.toLowerCase() === username.toLowerCase()
            );

            if (!userContributor) continue;

            const ownership =
                (userContributor.contributions / totalCommits) * 100;

            totalOwnership += ownership;
            analyzedRepos++;

            if (ownership > 70) {
                dominantProjects++;
            } else {
                teamProjects++;
            }

        } catch (err) {
            // ignore repo errors
        }

    }

    const avgOwnership =
        analyzedRepos > 0 ? totalOwnership / analyzedRepos : 0;

    return {
        avgOwnership: Math.round(avgOwnership),
        teamProjects,
        dominantProjects
    };

};