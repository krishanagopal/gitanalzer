export const analyzeCommits = async (repos, githubClient) => {

    let totalCommits = 0;
    let conventionalCommits = 0;
    let totalMessageLength = 0;

    const conventionalPrefixes = [
        "feat",
        "fix",
        "docs",
        "refactor",
        "test",
        "chore"
    ];

    for (const repo of repos) {

        try {

            const res = await githubClient.get(
                `/repos/${repo.owner.login}/${repo.name}/commits?per_page=10`
            );

            const commits = res.data;

            commits.forEach(commit => {

                const message = commit.commit.message;

                totalCommits++;

                totalMessageLength += message.length;

                const lowerMsg = message.toLowerCase();

                if (
                    conventionalPrefixes.some(prefix =>
                        lowerMsg.startsWith(prefix)
                    )
                ) {
                    conventionalCommits++;
                }

            });

        } catch (err) {
            // ignore repo errors
        }

    }

    const avgMessageLength =
        totalCommits > 0 ? totalMessageLength / totalCommits : 0;

    const conventionalRatio =
        totalCommits > 0 ? (conventionalCommits / totalCommits) * 100 : 0;

    return {
        totalCommitsAnalyzed: totalCommits,
        conventionalCommits,
        conventionalRatio: Math.round(conventionalRatio),
        avgMessageLength: Math.round(avgMessageLength)
    };

};