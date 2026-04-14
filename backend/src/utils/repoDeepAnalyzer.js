const PROFESSIONAL_FOLDERS = ['src', 'controllers', 'services', 'routes', 'utils', 'config', 'tests', 'api', 'lib', 'components', 'models', 'docs', 'internal', 'pkg'];
const REQUIRED_README_SECTIONS = ['feature', 'install', 'usage', 'tech', 'demo', 'architecture', 'screenshot', 'setup', 'requirement'];

/**
 * Performs deep repository checks by analyzing the root directory structure, README content, and workflow signals.
 * This identifies:
 * 1. README presence and structural quality (Professionalism)
 * 2. Logical folder structure (Architectural depth)
 * 3. Workflow hygiene (Branches, Releases, Issues, Projects)
 * 4. Profile Branding (Special username/username repository)
 * 5. CI/CD usage (.github/workflows)
 */
export const analyzeRepoHealth = async (repos, githubClient) => {
    let cicdRepos = 0;
    const undocumentedRepos = [];
    const reposWithoutLicense = [];
    const flatStructureRepos = [];
    const poorDocsRepos = [];
    
    let totalArchitectureScore = 0;
    let totalReadmeQualityScore = 0;
    
    let reposWithReleases = 0;
    let reposWithMultipleBranches = 0;
    let reposWithProjects = 0;

    let profileBrandingScore = 0;
    let hasProfileReadme = false;

    // Filter out forks for documentation analysis as we mainly care about the user's own projects
    const originalRepos = repos.filter(repo => !repo.fork && repo.size > 0);
    
    if (originalRepos.length === 0) {
        return {
            cicdRepos: 0,
            undocumentedRepos: [],
            reposWithoutLicense: [],
            flatStructureRepos: [],
            poorDocsRepos: [],
            documentationScore: 0,
            architectureScore: 0,
            readmeQualityScore: 0,
            profileBrandingScore: 0,
            hasProfileReadme: false,
            workflowStats: {
                reposWithReleases: 0,
                reposWithMultipleBranches: 0,
                reposWithProjects: 0
            }
        };
    }

    // Process repositories
    const results = await Promise.all(originalRepos.map(async (repo) => {
        try {
            // 1. Fetch root contents (for folders and filenames)
            const res = await githubClient.get(
                `/repos/${repo.owner.login}/${repo.name}/contents`
            );
            
            const files = res.data;
            if (!Array.isArray(files)) return null;

            const fileNames = files.map(f => f.name.toLowerCase());
            const dirs = files.filter(f => f.type === 'dir').map(f => f.name.toLowerCase());

            // 2. Check for README existence and quality
            const readmeFile = files.find(f => {
                const name = f.name.toLowerCase();
                return name === "readme.md" || name === "readme" || name === "readme.txt" || name === "readme.rst";
            });
            
            let readmeScore = 0;
            if (!readmeFile) {
                undocumentedRepos.push(repo.name);
            } else {
                try {
                    const readmeRes = await githubClient.get(
                        `/repos/${repo.owner.login}/${repo.name}/readme`
                    );
                    const content = Buffer.from(readmeRes.data.content, 'base64').toString('utf8').toLowerCase();
                    
                    // Specific check for Profile README (username/username) - Personal Branding Audit
                    if (repo.name.toLowerCase() === repo.owner.login.toLowerCase()) {
                        hasProfileReadme = true;
                        let brandingScore = 0;
                        if (content.match(/hi|welcome|i'm/)) brandingScore += 25;
                        if (content.match(/tech|tool|stack|skill/)) brandingScore += 25;
                        if (content.match(/contact|linkedin|email|reach|social/)) brandingScore += 25;
                        if (content.match(/stats|vercel\.app|metrics|chart|streak/)) brandingScore += 25;
                        profileBrandingScore = brandingScore;
                    }

                    const sectionsFound = REQUIRED_README_SECTIONS.filter(section => content.includes(section));
                    readmeScore = (sectionsFound.length / REQUIRED_README_SECTIONS.length) * 100;
                    if (readmeScore < 40) poorDocsRepos.push(repo.name);
                } catch (e) {}
            }

            // 3. Check for LICENSE
            const hasLicense = fileNames.some(name => 
                name === "license" || name.startsWith("license.") || name === "copying"
            );
            if (!hasLicense && !repo.license) reposWithoutLicense.push(repo.name);

            // 4. Check for Folder Architecture
            const professionalDirsFound = dirs.filter(d => PROFESSIONAL_FOLDERS.includes(d));
            const architectureScore = Math.min((professionalDirsFound.length / 3) * 100, 100);
            if (dirs.length > 0 && professionalDirsFound.length === 0 && files.length > 5) {
                flatStructureRepos.push(repo.name);
            }

            // 5. Check for Workflow Features (Branches & Releases)
            const [branchesRes, releasesRes] = await Promise.all([
                githubClient.get(`/repos/${repo.owner.login}/${repo.name}/branches?per_page=2`).catch(() => ({ data: [] })),
                githubClient.get(`/repos/${repo.owner.login}/${repo.name}/releases?per_page=1`).catch(() => ({ data: [] }))
            ]);

            const hasMultipleBranches = branchesRes.data.length > 1;
            const hasReleases = releasesRes.data.length > 0;
            const hasProjects = repo.has_projects;

            // 6. Check for CI/CD
            const hasGithubFolder = dirs.includes(".github");
            let hasWorkflow = false;
            if (hasGithubFolder) {
                try {
                    const githubRes = await githubClient.get(
                        `/repos/${repo.owner.login}/${repo.name}/contents/.github`
                    );
                    hasWorkflow = Array.isArray(githubRes.data) && githubRes.data.some(f => 
                        f.name === "workflows" && f.type === "dir"
                    );
                } catch (e) {}
            }

            return {
                cicd: hasWorkflow,
                architectureScore,
                readmeScore,
                hasMultipleBranches,
                hasReleases,
                hasProjects
            };

        } catch (err) {
            return null;
        }
    }));

    // Aggregate results
    let validResultsCount = 0;
    results.forEach(r => {
        if (r) {
            validResultsCount++;
            if (r.cicd) cicdRepos++;
            if (r.hasMultipleBranches) reposWithMultipleBranches++;
            if (r.hasReleases) reposWithReleases++;
            if (r.hasProjects) reposWithProjects++;
            totalArchitectureScore += r.architectureScore;
            totalReadmeQualityScore += r.readmeScore;
        }
    });

    const docScore = originalRepos.length > 0 ? ((originalRepos.length - undocumentedRepos.length) / originalRepos.length) * 100 : 0;
    
    return {
        cicdRepos,
        undocumentedRepos: undocumentedRepos.slice(0, 5),
        reposWithoutLicense: reposWithoutLicense.slice(0, 5),
        flatStructureRepos: flatStructureRepos.slice(0, 5),
        poorDocsRepos: poorDocsRepos.slice(0, 5),
        documentationScore: Math.round(docScore),
        architectureScore: Math.round(validResultsCount > 0 ? totalArchitectureScore / validResultsCount : 0),
        readmeQualityScore: Math.round(validResultsCount > 0 ? totalReadmeQualityScore / validResultsCount : 0),
        profileBrandingScore,
        hasProfileReadme,
        workflowStats: {
            reposWithReleases,
            reposWithMultipleBranches,
            reposWithProjects,
            totalReposAnalyzed: originalRepos.length
        }
    };
};
