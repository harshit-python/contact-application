// controller to handle User model CRUD APIs

const  asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc Register a user
//@route POST /user/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body;
    if (!username || !email || !password){
        res.status(400)
        throw new Error("All fields are mandatory");
    }
    const userAvailable = await User.findOne({email});
    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered");
    }
    // creating hashed password using bcrypt, 10 is the saltrounds
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        username, email, password: hashedPassword
    });
    console.log("user created successfully");    
    if (user) {
        res.status(201).json({_id: user.id, email: user.email})
    } else {
        res.status(400);
        throw new Error("User data is not valid");
    }
});

//@desc Login a user
//@route POST /user/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const userAvailable = await User.findOne({email});
    if (!userAvailable) {
        res.status(400);
        throw new Error("User with this email not found");
    }
    // compare password with hashedpasword
    if (userAvailable && (await bcrypt.compare(password, userAvailable.password))) {
        // creating new access token
        const accesstoken = jwt.sign({
            // passing user data
            user: {
                username: userAvailable.username,
                email: userAvailable.email,
                id: userAvailable.id
            },
        },
        // access token secret from env
        process.env.ACCESS_TOKEN_SECRET,
        // set token expiration time currently setting to 60 mins
        {expiresIn: "60m"}
        )
        res.status(200).json({accesstoken});
    } else {
        res.status(401);
        throw new Error("Pasword is not valid")
    }
});

//@desc Current user info
//@route POST /user/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
    // we are appending user in req inside validateTokenHandler
    res.json(req.user);
});

module.exports = {registerUser, loginUser, currentUser};