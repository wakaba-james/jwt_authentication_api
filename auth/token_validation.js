const {verify} = require("jsonwebtoken")

 module.exports ={
    check_token: (req,res, next) =>{
        secret_key = process.env.JWT_SECRET
        let token =  req.get("authorization");
        if(token){       
              token= token.slice(7)
              verify(token, secret_key,(err, decode)=>{
                if(err){
                    res.json({
                        success : 0,
                        message:"Invalid  token!"
                    })
                }else{
                    next()
                }
              })

        }else{
            res.json({
                success:0 ,
                message:"Access denied! Unauthorized user."
            })
        }
    }
 }