export const analyzeActivity = (events, username) => {

    let totalCommits = 0;
    let pullRequests = 0;
    let issues = 0;
    let releases = 0;
    const activeMonths = new Set();
    const eventTypesFound = new Set();
    
    const ossActivity = {
        externalPRs: 0,
        forks: 0,
        externalIssues: 0
    };

    events.forEach(event => {
        eventTypesFound.add(event.type);
        const date = new Date(event.created_at);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        activeMonths.add(monthKey);

        const isExternalRepo = event.repo && event.repo.name && !event.repo.name.startsWith(`${username}/`);

        if (event.type === "PushEvent") {
            totalCommits += event.payload.commits?.length || 0;
        } else if (event.type === "PullRequestEvent") {
            pullRequests++;
            if (isExternalRepo) ossActivity.externalPRs++;
        } else if (event.type === "IssuesEvent" || event.type === "IssueCommentEvent") {
            issues++;
            if (isExternalRepo) ossActivity.externalIssues++;
        } else if (event.type === "ReleaseEvent") {
            releases++;
        } else if (event.type === "ForkEvent") {
            ossActivity.forks++;
        }
    });

    const workflowDiversity = Array.from(eventTypesFound).filter(t => 
        ["PullRequestEvent", "IssuesEvent", "ReleaseEvent", "IssueCommentEvent"].includes(t)
    ).length;

    return {
        totalCommits,
        pullRequests,
        issues,
        releases,
        activeMonths: activeMonths.size,
        workflowDiversity,
        ossActivity
    };

};