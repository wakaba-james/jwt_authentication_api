const {create, get_users,update_user, getUserByEmail} = require("../models/user_models.js")
const {genSaltSync,hashSync,compareSync,compare} = require("bcrypt")
const {sign} = require("jsonwebtoken")
const register_user =async(req, res) =>{

    const body = req.body;
    const salt = genSaltSync(10)
    body.password = await hashSync(body.password, salt)
    try{
        create(body,(error, results)=>{
          if(error){
            console.log(error)
            return res.status(500).json({
              success: 0,
              message:"Database connection error!"
            })
          } 
          
          res.status(200).json({
            success:1,
            data:results
          })
        })

    }
    catch(error){
        console.error("Unexpected error:", error);
        return res
          .status(500)
          .json({ error: "Unexpected error occurred"});
    }
    
}

const get_all_users = async(req, res)=>{

    get_users((error, results)=>{
        if(error){
            console.log(error)
            return res.status(500).json({
              success: 0,
              message:"Error occured in retriving data from database!"
            })
          } 
          
          res.status(200).json({
            success:1,
            data:results
          }) 
    })

}

const update_users = (req, res) => {
   
    const userId = req.params.userId;
    const newUserData = req.body;
    if (!newUserData || !newUserData.first_name || !newUserData.last_name || !newUserData.email || !newUserData.password) {
        return res.status(400).json({
            success: 0,
            message: "Missing required fields in request body!"
        });
    }

    update_user(userId, newUserData, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({
                success: 0,
                message: "Error occurred while updating the user data!"
            });
        }

        if (result.success === 0) {
            return res.status(404).json(result); 
        }

        return res.status(200).json(result); 
    });
};

const login = async (req, res) => {
    const body = req.body;

    // Check if email and password are provided
    if (!body.email || !body.password) {
        return res.status(400).json({
            success: 0,
            message: "Email and password are required!",
        });
    }

    // Get user by email
    getUserByEmail(body.email, (error, user) => {
        if (error) {
            console.error("Error fetching user by email:", error);
            return res.status(500).json({
                success: 0,
                message: "An error occurred during login.",
            });
        }

        if (!user) {
            return res.status(404).json({
                success: 0,
                message: "User not found!",
            });
        }

        // Debug: Check the retrieved user data
        console.log("Retrieved user:", user);

        try {
            // Debug: Check provided password and hashed password
            console.log("Provided password:", body.password);
            console.log("Stored hashed password:", user.password);

            // Compare the provided password with the hashed password
            const isMatch = compare(body.password, user.password);
            console.log(isMatch)
            console.log("Password match result:", isMatch);

            if (!isMatch) {
                return res.status(401).json({
                    success: 0,
                    message: "Invalid credentials!",
                });
            }

            // Generate a JWT
            const payload = { id: user.id, email: user.email };
            const secret = process.env.JWT_SECRET || "fallback-secret-key";
            const options = { expiresIn: "1h" };

            const token = sign(payload, secret, options);

            return res.status(200).json({
                success: 1,
                message: "Login successful!",
                token,
            });
        } catch (err) {
            console.error("Error during password comparison:", err);
            return res.status(500).json({
                success: 0,
                message: "An error occurred during login.",
            });
        }
    });
};







module.exports ={
    register_user,
    get_all_users,
    update_users,
    login
}