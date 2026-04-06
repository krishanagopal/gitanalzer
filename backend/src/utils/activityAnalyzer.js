export const analyzeActivity = (events) => {

    let totalCommits = 0;
    const activeMonths = new Set();

    events.forEach(event => {

        if (event.type === "PushEvent") {

            totalCommits += event.payload.commits.length;

            const date = new Date(event.created_at);

            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

            activeMonths.add(monthKey);
        }

    });

    return {
        totalCommits,
        activeMonths: activeMonths.size
    };

};