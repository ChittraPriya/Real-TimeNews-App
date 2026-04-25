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
     login: async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User doesn't exist"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: "Login Successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
},
updateEmail: async (req, res) => {
  try {
    const { email } = req.body;

    // 1. validate input
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // 2. safety check (VERY IMPORTANT)
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 3. update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { email },
      { returnDocument: "after" } 
    );

    // 4. check if user exists
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Email updated successfully",
      email: updatedUser.email
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
},
     logout : async(req,res) => {
        try {
            res.status(200).json({message:"Logout Successfully"})
        } catch (error) {
            res.status(500).json({message: "Error for Registering User", error: error.message})
        }
    }

}

module.exports= authController
