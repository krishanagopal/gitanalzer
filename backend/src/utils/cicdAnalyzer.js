export const analyzeCICD = async (repos, githubClient) => {

    let cicdRepos = 0;

    for (const repo of repos) {

        try {

            const res = await githubClient.get(
                `/repos/${repo.owner.login}/${repo.name}/contents/.github`
            );

            const files = res.data;

            const hasWorkflow = files.some(file =>
                file.name === "workflows"
            );

            if (hasWorkflow) {
                cicdRepos++;
            }

        } catch (err) {
            // repo may not contain .github folder
        }

    }

    return {
        cicdRepos
    };

};