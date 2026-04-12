export const analyzeProsCons = (repoStats, activityStats, commitStats, cicdStats, repos) => {
    const pros = [];
    const cons = [];

    // --- PROS (Recruiter Signals) ---
    
    // 1. Strong Pinned / Top Repos
    if (repoStats.highestStars >= 10) {
        pros.push({
            title: "Portfolio Flagship",
            description: "You have projects with significant community validation (stars), showing you build things people find useful.",
            impact: "High"
        });
    }

    // 2. Commit Quality
    if (commitStats.conventionalRatio > 70) {
        pros.push({
            title: "Conventional Mastery",
            description: "Excellent use of Conventional Commits, making your engineering history professional and easy to audit.",
            impact: "High"
        });
    } else if (commitStats.avgMessageLength > 30) {
         pros.push({
            title: "Verbose History",
            description: "Your commit messages are descriptive and detailed, which recruiters love for transparency.",
            impact: "Medium"
        });
    }

    // 3. Documentation
    if (repoStats.documentationScore > 80) {
        pros.push({
            title: "Documentation First",
            description: "Nearly all your active repositories are well-documented with descriptions and wikis.",
            impact: "High"
        });
    }

    // 4. Live Demos
    const hasLiveDemos = repos.some(r => r.homepage && r.homepage.trim() !== "");
    if (hasLiveDemos) {
        pros.push({
            title: "Deployment Ready",
            description: "You include live demo links in your repositories, proving your code works in production environments.",
            impact: "High"
        });
    }

    // 5. Tech Focus & Breadth
    if (repoStats.languages.length >= 5) {
        pros.push({
            title: "Prolific Polyglot",
            description: "You are comfortable working across a diverse range of technologies and languages.",
            impact: "Medium"
        });
    }

    // 6. Consistency
    if (commitStats.longestStreak > 21 || activityStats.activeMonths >= 10) {
        pros.push({
            title: "Consistency King",
            description: "Demonstrates remarkable long-term discipline and commitment to the craft of coding.",
            impact: "High"
        });
    }

    // 7. CI/CD & Reliability
    if (cicdStats.cicdRepos > 0) {
        pros.push({
            title: "Reliability Focused",
            description: "Experience with GitHub Actions/CI-CD shows you care about automated testing and quality.",
            impact: "Medium"
        });
    }

    // 8. Hygiene
    const hasLicense = repos.some(r => r.license);
    if (hasLicense) {
        pros.push({
            title: "Open Source Hygiene",
            description: "Your projects follow best practices by including proper licensing and open-source standards.",
            impact: "Low"
        });
    }


    // --- CONS (Optimization Opportunities) ---

    // 1. Documentation Gaps (Focus on READMEs)
    if (repoStats.documentationScore < 100 && repoStats.undocumentedRepos.length > 0) {
        cons.push({
            title: "Documentation Gaps",
            description: "Some of your projects are missing README.md files, which are essential for engineering audits.",
            repos: repoStats.undocumentedRepos,
            suggestion: "Add a clear README.md to these repositories to explain the project's purpose and how to run it."
        });
    }

    // 2. Commit Structure
    if (commitStats.conventionalRatio < 20 && commitStats.totalCommitsAnalyzed > 10) {
        cons.push({
            title: "Unstructured History",
            description: "Your commit messages often lack a standard format (like Conventional Commits).",
            suggestion: "Try using 'feat:', 'fix:', and 'docs:' prefixes in your next project."
        });
    }

    // 3. Tech Lock-in
    if (repoStats.languages.length <= 2 && repoStats.activeRepos > 3) {
        cons.push({
            title: "Narrow Tech Stack",
            description: "Most of your work is concentrated in a single language, which might hide your versatility.",
            suggestion: "Consider experimenting with another language (e.g., TypeScript or Go) for a small project."
        });
    }

    // 4. Maintenance
    if (repoStats.avgDaysSinceUpdate > 150) {
        cons.push({
            title: "Low Maintenance",
            description: "Your repositories haven't seen much activity recently, which might signal stagnant projects.",
            suggestion: "Do a quick 'spring cleaning' or add a new feature to your flagship repo."
        });
    }

    // 5. Missing Hygiene
    if (repoStats.reposWithoutLicense && repoStats.reposWithoutLicense.length > 0) {
        cons.push({
            title: "Missing Licenses",
            description: "Your projects don't have explicit licenses, which can be a red flag for legal and professional collaboration.",
            repos: repoStats.reposWithoutLicense,
            suggestion: "Add an MIT or Apache license to your public repositories to make them 'open-source ready'."
        });
    }

    return { pros, cons };
};
