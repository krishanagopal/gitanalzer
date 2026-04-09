import axios from "axios";


const githubClient = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json"
  }
});

githubClient.interceptors.request.use((config) => {
  if (process.env.GITHUB_TOKEN) {
    config.headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  }
  return config;
});

export default githubClient;