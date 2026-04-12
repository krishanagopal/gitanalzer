/**
 * Performs deep repository checks by analyzing the root directory structure.
 * This identifies:
 * 1. README presence (professional documentation)
 * 2. .github folder (potential CI/CD or template usage)
 * 3. LICENSE presence (open source hygiene)
 */
export const analyzeRepoHealth = async (repos, githubClient) => {
    let cicdRepos = 0;
    const undocumentedRepos = [];
    const reposWithoutLicense = [];

    // Filter out forks for documentation analysis as we mainly care about the user's own projects
    const originalRepos = repos.filter(repo => !repo.fork && repo.size > 0);

    for (const repo of originalRepos) {
        try {
            // Fetch root contents
            const res = await githubClient.get(
                `/repos/${repo.owner.login}/${repo.name}/contents`
            );
            
            const files = res.data;
            if (!Array.isArray(files)) continue;

            const fileNames = files.map(f => f.name.toLowerCase());

            // 1. Check for README
            const hasReadme = fileNames.some(name => 
                name === "readme.md" || 
                name === "readme" || 
                name === "readme.txt" || 
                name === "readme.rst"
            );
            
            if (!hasReadme) {
                undocumentedRepos.push(repo.name);
            }

            // 2. Check for LICENSE
            const hasLicense = fileNames.some(name => 
                name === "license" || 
                name.startsWith("license.") ||
                name === "copying"
            );

            if (!hasLicense && !repo.license) {
                reposWithoutLicense.push(repo.name);
            }

            // 3. Check for CI/CD in .github/workflows
            const githubFolder = files.find(f => f.name === ".github" && f.type === "dir");
            if (githubFolder) {
                try {
                    const githubRes = await githubClient.get(
                        `/repos/${repo.owner.login}/${repo.name}/contents/.github`
                    );
                    const githubFiles = githubRes.data;
                    const hasWorkflow = Array.isArray(githubFiles) && githubFiles.some(f => 
                        f.name === "workflows" && f.type === "dir"
                    );
                    
                    if (hasWorkflow) {
                        cicdRepos++;
                    }
                } catch (e) {
                    // .github might exist but workflows might not
                }
            }

        } catch (err) {
            // Skip repo if contents cannot be fetched (e.g., empty or private)
            if (!repo.has_readme) { // Fallback check if the API provides it (though usually not for bulk)
                // undocumentedRepos.push(repo.name);
            }
        }
    }

    const documentationScore = originalRepos.length > 0 
        ? ((originalRepos.length - undocumentedRepos.length) / originalRepos.length) * 100 
        : 0;

    return {
        cicdRepos,
        undocumentedRepos: undocumentedRepos.slice(0, 10), // Return top 10 for cleaner UI
        reposWithoutLicense: reposWithoutLicense.slice(0, 10),
        documentationScore: Math.round(documentationScore)
    };
};
