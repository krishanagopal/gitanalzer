export const getGithubProfile =(req,res) =>{
    const {username}=req.params;

    res.json({
        message: `Analyzing GitHub profile for ${username}`
    });
};