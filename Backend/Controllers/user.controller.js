const User = require("../models/user.model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getDataUri = require("../utils/datauri");
const cloudinary  = require("../utils/cloudinary");

const register = async(req , res)=>{
    try{
        const {name , email, phoneNumber, password} = req.body;
        
        if(!name || !email || !phoneNumber || !password ){
            return res.status(400).json({
                message:"Something is missing",
                success:false
            }) 
        }

        const {role} = req.body;
        const roleValue = role ? role : "attendee";

        const file = req.file;
      
        if(!file){
            return res.status(400).json({
                message:"Profile photo is required",
                success:false
            })
        }
        const fileUri = getDataUri(file);
        // console.log(fileUri);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        

        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                message:"User already exists",
                success:false
            })
        }

        const hashedPassword = await bcrypt.hash(password , 10);

        user = await User.create({
            name,
            email,
            phoneNumber,
            password:hashedPassword,
            role:roleValue,
            profile:{
                profilePhoto:cloudResponse?.secure_url,
            }
        })

    
        return res.status(201).json({
            message:"Account created successfully , please login",
            user,
            success:true
        })

   }catch(err){
       console.log(err);
       return res.status(500).json({
           message:"Internal server error",
           success:false
       })
   };
   
}

const login = async(req, res)=>{
    try{
       const {email , password } = req.body;

       if(!email || !password ){
         return res.status(400).json({
             message:"Something is Missing",
             success:false
          })
       }

       let user = await User.findOne({email});
       if(!user){
        return res.status(400).json({
            message:"Incorrect email or password",
            success:false
         })
       }

       const passMatched = await bcrypt.compare(password, user.password);
        if(!passMatched) {
           return res.status(400).json({
                message:"Incorrect email or password",
                success:false
            })
        }

        const tokenData = {
            userId: user._id
        }
       const token = await jwt.sign(tokenData , process.env.SECRET_KEY, {expiresIn: '1d'});

       user = {
         _id:user._id,
         name:user.name,
         email:user.email,
         phoneNumber:user.phoneNumber,
         role:user.role,
         profile:user.profile
       }

       return res.status(200)
        .cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            secure: true,               // ✅ Important for HTTPS
            sameSite: "None"            // ✅ Critical for cross-origin (Vercel ↔ Railway)
        })
        .json({
            message: `Welcome back ${user.name}`,
            user,
            success: true
        });

    }catch(err){
        console.log(err);
    }
}

const logout = async (req, res)=>{
    //  res.clearCookie("token", {
    //   httpOnly: true,
    //   secure: true,     // agar https use kar raha hai to
    //   sameSite: "strict"
    // });
    
    try {
        return res.status(200).cookie("token" , "" , {maxAge:0}).json({
            message:"Logged out Succesfully",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

const updateprofile = async(req, res)=>{
    try {
        const {name, email, phoneNumber, bio, interests} = req.body;
        const file = req.file;

        //cloudinary
        

        const interestArray = interests?.split(",");
        const userId = req.id;
         
        let user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                message:"User is not found",
                success:false
            })
        }

        // cloudinary implementation
        if(file){
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            user.profile.profilePhoto = cloudResponse?.secure_url;
        }

        if(name) user.name = name;
        if(email) user.email = email;
        if(phoneNumber) user.phoneNumber = phoneNumber;
        if(bio)user.profile.bio = bio;
        if(interests) user.profile.interests = interestArray;

        await user.save();
        
        user = {
            _id:user._id,
            name:user.name,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile
          }

        return res.status(200).json({
            message:"Profile updated successfully",
            user,
            success:true
        })  

    } catch (error) {
        console.log(error);
    }
}

const updateProfilephoto = async(req, res)=>{
    try {
        const file = req.file;

        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const userId = req.id;
         
        
        let user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                message:"User is not found",
                success:false
            })
        }

        user.profile.profilePhoto = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message:"Profile photo updated successfully",
            user,
            success:true
        })

    } catch (error) {
        console.log(error);
    }
}

const resetPassword = async(req, res)=>{
    try {
        const { email, password } = req.body;

        // Validate user
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({
            message: "Password reset successfully, please login",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {register , login, logout, updateprofile, updateProfilephoto, resetPassword};