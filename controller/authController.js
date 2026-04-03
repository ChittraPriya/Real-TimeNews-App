const User = require('../models/userModel.js')
const bcrypt = require('bcrypt')
const { JWT_SECRET, NODE_ENV } = require('../utils/config.js')
const jwt = require('jsonwebtoken')

const authController = {
    register: async(req,res) => {
        try {
            //get details from the req body
            const {name, email,password} = req.body

            //check if the user exists already
            const existingUser = await User.findOne({email})

            if(existingUser) {
                return res.status(400).json({message: 'User is Already Exists'})
            }

            //encrypt password
            const hashedPassword =await bcrypt.hash(password, 10)

            //create a new User
            const newUser =  new User ({name, email, password: hashedPassword})

            //save user in database
            await newUser.save()

            res.status(200).json({message: 'User Registered Successfully'})
        } catch (error) {
            res.status(500).json({message: "Error for Registering User", error: error.message})
        }
    },
     login: async(req,res) => {
        try {
            //get details from the req body
            const {email,password} = req.body;

            //find the user by the email
            const user = await User.findOne({email})

            if(!user){
                return res.status(400).json({message: "User Doesn't exists"})
            }

            //compare the password
            const isMatch = await bcrypt.compare(password, user.password)

            if(!isMatch){
                return res.status(400),json({message:"Invalid Password"})
            }

            //generate a token
            const token = jwt.sign({userId : user._id},JWT_SECRET,{expiresIn : '1h'})

            //set a token as cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: NODE_ENV === 'production',
                sameSite: NODE_ENV === 'production' ? 'none' : "lax",
                maxAge: 24* 60 * 60*1000
            })
            res.status(200).json({message:"Login Successfully"})
        } catch (error) {
            res.status(500).json({message: "Error for Registering User", error: error.message})
        }
    },
     logout : async(req,res) => {
        try {
            res.status(200).json({message:"Registered Successfully"})
        } catch (error) {
            res.status(500).json({message: "Error for Registering User", error: error.message})
        }
    }

}

module.exports= authController