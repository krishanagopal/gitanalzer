import { fetchGithubData } from "../services/github.service.js";
export const getGithubProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const data = await fetchGithubData(username);
        res.json(data);
    } catch (error) {
        console.error("Error fetching github data:", error?.response?.data || error);
        res.status(error?.response?.status || 500).json({ 
            error: error?.response?.data?.message || "Failed to fetch GitHub data" 
        });
    }
};