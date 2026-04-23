export const analyzeProsCons = (repoStats, activityStats, commitStats, cicdStats, repos) => {
    const pros = [];
    const cons = [];

    // --- PROS (Recruiter Signals) ---
    
    // 1. Strong Pinned / Top Repos
    if (repoStats.highestStars >= 10 && repoStats.topProjects?.length > 0) {
        pros.push({
            title: "Portfolio Flagship",
            description: `Projects like ${repoStats.topProjects[0].name} have significant community validation (${repoStats.topProjects[0].stars} stars), showing you build things people find useful.`,
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
    const liveDeployments = repos.filter(r => r.homepage && r.homepage.trim() !== "");
    if (repoStats.deploymentScore > 20 || liveDeployments.length > 0) {
        const repoName = liveDeployments.length > 0 ? liveDeployments[0].name : "your projects";
        pros.push({
            title: "Deployment Ready",
            description: `You include live demo links in repositories like ${repoName}, proving your code works in production environments.`,
            impact: "High"
        });
    }
    
    // Testing & OSS
    if (repoStats.testingScore > 40) {
        pros.push({
            title: "Test-Driven Mindset",
            description: "You include test suites (e.g. jest, cypress, specs) in your projects, a strong signal for engineering reliability.",
            impact: "High"
        });
    }
    if (activityStats.ossActivity && (activityStats.ossActivity.externalPRs > 0 || activityStats.ossActivity.forks > 0)) {
        pros.push({
            title: "Open Source Contributor",
            description: "You actively engage with the open-source community through forks and external pull requests.",
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


    // 9. Architectural Excellence
    if (repoStats.architectureScore >= 70) {
        pros.push({
            title: "Clean Architect",
            description: "Your projects follow professional folder structures (src, utils, controllers), showing you build modular, scalable systems.",
            impact: "High"
        });
    }

    // 10. Product Mindset
    if (repoStats.readmeQualityScore >= 60) {
        pros.push({
            title: "Product-Ready Quality",
            description: "Your READMEs go beyond basics, including Features, Setup, and Usage. This project-as-a-product mindset is rare and highly valued.",
            impact: "High"
        });
    }

    // 11. Feature Branch Mastery
    if (repoStats.workflowStats?.reposWithMultipleBranches > 0) {
        pros.push({
            title: "Feature Brancher",
            description: "You use multiple branches for development, suggesting a professional trunk-based or feature-branching workflow.",
            impact: "Medium"
        });
    }

    // 12. Release Discipline
    if (repoStats.workflowStats?.reposWithReleases > 0 || activityStats.releases > 0) {
        pros.push({
            title: "Release Disciplined",
            description: "You utilize GitHub Releases to version your software, ensuring stability and professional distribution.",
            impact: "High"
        });
    }

    // 13. Workflow Variety
    if (activityStats.workflowDiversity >= 3) {
        pros.push({
            title: "Workflow Pro",
            description: "You utilize a wide variety of GitHub features (Issues, PRs, Projects) to manage your development lifecycle.",
            impact: "High"
        });
    }

    // 14. Personal Branding
    if (repoStats.profileBrandingScore >= 50) {
        pros.push({
            title: "Branded Engineer",
            description: "You have a professional Profile README that effectively communicates your value proposition and tech stack.",
            impact: "High"
        });
    } else if (repoStats.profileBrandingScore >= 75) {
        pros.push({
            title: "Visual Communicator",
            description: "Your profile is exceptionally well-branded with stats, icons, and clear navigation for recruiters.",
            impact: "High"
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

    // 2. Barebones Documentation (Style Gaps)
    if (repoStats.poorDocsRepos && repoStats.poorDocsRepos.length > 0) {
        cons.push({
            title: "Documentation Depth",
            description: `Repositories like ${repoStats.poorDocsRepos[0]} have READMEs, but they lack professional sections like 'Installation' or 'Features'.`,
            repos: repoStats.poorDocsRepos,
            suggestion: "A 'Product' README should include: Features, Tech Stack, Demo, Installation, and Usage sections."
        });
    }

    // 3. Flat Project Hierarchy
    if (repoStats.flatStructureRepos && repoStats.flatStructureRepos.length > 0) {
        cons.push({
            title: "Flat Project Structure",
            description: `Projects like ${repoStats.flatStructureRepos[0]} have all files in the root directory rather than using a modular 'src' or 'lib' hierarchy.`,
            repos: repoStats.flatStructureRepos,
            suggestion: "Adopt standard folder patterns (e.g., /src, /controllers, /utils) to show you can manage complex codebases."
        });
    }

    // 4. Solo Development Pattern
    if (activityStats.pullRequests === 0 && repoStats.workflowStats?.reposWithMultipleBranches === 0 && repoStats.activeRepos > 3) {
        cons.push({
            title: "Solo Dev Pattern",
            description: "Most of your work is pushed directly to 'main' without using Pull Requests or branching.",
            suggestion: "Try using the 'GitHub Flow' (branching and PRs) even on your own projects to simulate professional team environments."
        });
    }

    // 5. Missing Versioning
    if (repoStats.workflowStats?.reposWithReleases === 0 && repoStats.activeRepos > 5) {
        cons.push({
            title: "Missing Versioning",
            description: "Your projects don't use 'Releases' or tags to mark stable versions.",
            suggestion: "Use GitHub Releases to tag 'v1.0.0' or 'v0.1.0' milestones to show you understand the software release lifecycle."
        });
    }

    // 6. Commit Structure
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

    // 9. Stealth Profile
    if (!repoStats.hasProfileReadme) {
        cons.push({
            title: "Stealth Mode Profile",
            description: "You are missing a GitHub Profile README (the special repository matching your username).",
            suggestion: "Create a repository named exactly after your username to build a professional landing page with an intro and tech stack."
        });
    }

    return { pros, cons };
};
