export const analyzeActivity = (events) => {

    let totalCommits = 0;
    let pullRequests = 0;
    let issues = 0;
    let releases = 0;
    const activeMonths = new Set();
    const eventTypesFound = new Set();

    events.forEach(event => {
        eventTypesFound.add(event.type);
        const date = new Date(event.created_at);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        activeMonths.add(monthKey);

        if (event.type === "PushEvent") {
            totalCommits += event.payload.commits?.length || 0;
        } else if (event.type === "PullRequestEvent") {
            pullRequests++;
        } else if (event.type === "IssuesEvent" || event.type === "IssueCommentEvent") {
            issues++;
        } else if (event.type === "ReleaseEvent") {
            releases++;
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
        workflowDiversity
    };

};