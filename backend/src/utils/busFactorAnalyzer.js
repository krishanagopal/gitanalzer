export const analyzeBusFactor = async (repos, githubClient) => {

    let soloProjects = 0;
    let collaborativeProjects = 0;

    for (const repo of repos) {

        try {

            const res = await githubClient.get(
                `/repos/${repo.owner.login}/${repo.name}/contributors?per_page=5`
            );

            const contributors = res.data || [];

            if (contributors.length <= 1) {
                soloProjects++;
            } else {
                collaborativeProjects++;
            }

        } catch (err) {
            // ignore repo errors
        }

    }

    return {
        soloProjects,
        collaborativeProjects
    };

};