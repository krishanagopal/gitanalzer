export const analyzeRepos = (repos) => {

    let totalStars = 0;
    let activeRepos = 0;

    const languages = new Set();
    const languageBreakdown = {};

    repos.forEach(repo => {

        totalStars += repo.stargazers_count;

        if (!repo.fork && repo.size > 0) {
            activeRepos++;
        }

        if (repo.language) {

            languages.add(repo.language);

            if (languageBreakdown[repo.language]) {
                languageBreakdown[repo.language]++;
            } else {
                languageBreakdown[repo.language] = 1;
            }

        }

    });

    return {
        totalStars,
        activeRepos,
        languages: Array.from(languages),
        languageBreakdown
    };
};