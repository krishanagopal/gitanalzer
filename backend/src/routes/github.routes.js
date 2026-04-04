import express from "express";
import { getGithubProfile } from "../controllers/github.controller.js";
const router =express.Router();

router.get("/:username", getGithubProfile
);

export default router;