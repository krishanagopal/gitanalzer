import { fetchGithubData } from "../services/github.service.js";
export const getGithubProfile = async (req, res) => {

    const { username } = req.params;

    const data = await fetchGithubData(username);

    res.json(data);

};