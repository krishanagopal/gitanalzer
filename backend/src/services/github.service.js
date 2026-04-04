import githubClient from "../config/github.js";


export const fetchGithubData = async (username) => {

    const userResponse = await githubClient.get(`/users/${username}`);

    return {
        profile: userResponse.data
    };

};