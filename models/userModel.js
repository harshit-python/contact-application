// user model

const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide the username"],
    },
    email: {
        type: String,
        required: [true, "Please add the user email address"],
        unique: [true, "Provided email is already registered"]
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
    },
}, {
    timestamps: true,
})

// exporting model
module.exports = mongoose.model("User", userSchema);