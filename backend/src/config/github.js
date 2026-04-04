import axios from "axios";


const githubClient = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json"
  }
});

export default githubClient;