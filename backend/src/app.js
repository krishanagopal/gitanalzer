import "dotenv/config";
import express from "express";
import githubRoutes from "./routes/github.routes.js";
 import cors from "cors";
 


 const app=express();

 app.use(cors());
 app.use(express.json());

 app.use("/api/github", githubRoutes);
 app.get("/",(req,res)=>{
    res.send("API is running...")
 });

 export default app;