export const analyzeCommits = async (repos, githubClient) => {
    let totalCommits = 0;
    let conventionalCommits = 0;
    let totalMessageLength = 0;

    const typeDistribution = { feat: 0, fix: 0, docs: 0, refactor: 0, test: 0, chore: 0, other: 0 };
    const timeOfDay = { morning: 0, afternoon: 0, evening: 0, night: 0 };
    const daysOfWeek = { weekend: 0, weekday: 0 };
    const allDates = [];

    const conventionalPrefixes = ["feat", "fix", "docs", "refactor", "test", "chore"];

    for (const repo of repos) {
        try {
            const res = await githubClient.get(
                `/repos/${repo.owner.login}/${repo.name}/commits?per_page=100`
            );

            const commits = res.data || [];
            if (!Array.isArray(commits)) throw new Error("Not an array");

            commits.forEach(commit => {
                const message = commit.commit.message;
                const lowerMsg = message.toLowerCase();
                const dateStr = commit.commit.author.date;

                totalCommits++;
                totalMessageLength += message.length;

                let foundType = false;
                for (const prefix of conventionalPrefixes) {
                    if (lowerMsg.startsWith(prefix)) {
                        typeDistribution[prefix]++;
                        conventionalCommits++;
                        foundType = true;
                        break;
                    }
                }
                if (!foundType) typeDistribution.other++;

                if (dateStr) {
                    const d = new Date(dateStr);
                    allDates.push(d);

                    const hour = d.getHours();
                    if (hour >= 6 && hour < 12) timeOfDay.morning++;
                    else if (hour >= 12 && hour < 18) timeOfDay.afternoon++;
                    else if (hour >= 18 && hour < 24) timeOfDay.evening++;
                    else timeOfDay.night++;

                    const day = d.getDay();
                    if (day === 0 || day === 6) daysOfWeek.weekend++;
                    else daysOfWeek.weekday++;
                }
            });
        } catch (err) {
            // ignore repo errors
        }
    }

    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    if (allDates.length > 0) {
        allDates.sort((a, b) => a - b);
        let uniqueDays = [...new Set(allDates.map(d => d.toISOString().split('T')[0]))];
        
        if (uniqueDays.length > 0) {
            let current = 1;
            let longest = 1;

            for (let i = 1; i < uniqueDays.length; i++) {
                const prev = new Date(uniqueDays[i-1]);
                const curr = new Date(uniqueDays[i]);
                const diffTime = Math.abs(curr - prev);
                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); 

                if (diffDays === 1) {
                    current++;
                    if (current > longest) longest = current;
                } else if (diffDays > 1) {
                    current = 1;
                }
            }
            longestStreak = longest;

            const today = new Date();
            const lastCommitDay = new Date(uniqueDays[uniqueDays.length - 1]);
            const diffFromToday = Math.round((today - lastCommitDay) / (1000 * 60 * 60 * 24));
            
            if (diffFromToday <= 2) {
                currentStreak = current;
            } else {
                currentStreak = 0;
            }
        }
    }

    const avgMessageLength = totalCommits > 0 ? totalMessageLength / totalCommits : 0;
    const conventionalRatio = totalCommits > 0 ? (conventionalCommits / totalCommits) * 100 : 0;

    return {
        totalCommitsAnalyzed: totalCommits,
        conventionalCommits,
        conventionalRatio: Math.round(conventionalRatio),
        avgMessageLength: Math.round(avgMessageLength),
        typeDistribution,
        timeOfDay,
        daysOfWeek,
        currentStreak,
        longestStreak
    };
};