import  express from 'express';
import { getGithubProfile } from "../controllers/github.controller.js";
const router =  express.Router();

router.get('/:username',(req,res)=>{
    res.json({
    message:"git analyzer route working"
    });

});

export default router;