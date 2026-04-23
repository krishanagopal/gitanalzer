export const analyzeRepos = (repos) => {
    let totalStars = 0;
    let activeRepos = 0;
    let archivedRepos = 0;
    let totalDaysSinceUpdate = 0;

    const languages = new Set();
    const languageBreakdown = {};
    const recentLanguageBreakdown = {};

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const today = new Date();

    const tutorialKeywords = ['tutorial', 'clone', 'bootcamp', 'learning', 'demo', 'course', '100days', 'practice'];
    
    const sortedRepos = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count);
    
    const seriousProjects = sortedRepos.filter(r => {
        const nameAndDesc = (r.name + ' ' + (r.description || '')).toLowerCase();
        return !tutorialKeywords.some(keyword => nameAndDesc.includes(keyword)) && !r.fork;
    });

    const topProjects = seriousProjects.slice(0, 2).map(r => ({
        name: r.name,
        html_url: r.html_url,
        description: r.description,
        stars: r.stargazers_count
    }));

    const highestStars = sortedRepos.length > 0 ? sortedRepos[0].stargazers_count : 0;
    const seriousReposCount = seriousProjects.length;

    repos.forEach(repo => {
        totalStars += repo.stargazers_count;

        if (repo.archived) {
            archivedRepos++;
        }

        if (!repo.fork && repo.size > 0) {
            activeRepos++;
            
            if (repo.updated_at) {
                const updatedDate = new Date(repo.updated_at);
                const diffTime = Math.abs(today - updatedDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                totalDaysSinceUpdate += diffDays;
            }
        }

        if (repo.language) {
            languages.add(repo.language);

            if (languageBreakdown[repo.language]) {
                languageBreakdown[repo.language]++;
            } else {
                languageBreakdown[repo.language] = 1;
            }

            const updatedDate = new Date(repo.updated_at);
            if (updatedDate >= sixMonthsAgo) {
                if (recentLanguageBreakdown[repo.language]) {
                    recentLanguageBreakdown[repo.language]++;
                } else {
                    recentLanguageBreakdown[repo.language] = 1;
                }
            }
        }
    });

    const avgDaysSinceUpdate = activeRepos > 0 ? totalDaysSinceUpdate / activeRepos : 0;

    return {
        totalStars,
        highestStars,
        topProjects,
        activeRepos,
        archivedRepos,
        avgDaysSinceUpdate: Math.round(avgDaysSinceUpdate),
        languages: Array.from(languages),
        languageBreakdown,
        recentLanguageBreakdown,
        seriousReposCount
    };
};