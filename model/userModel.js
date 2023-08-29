const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Full Name must Required!!"],
        
    },
    
    email: {
        type: String,
        required: [true, "Email must Required!!"],
        unique: true,
    },
    phone: {
        type: String,
        required: [true, "Phone  must Required!!"],
    },
    password: {
        type: String,
        required: [true, "Password must Required!!"],
    },
    
    role: {
        type: String,
        default: "User",
    },
    status: {
        type: String,
        default: "Active"
    }
})
const User = new mongoose.model("User", UserSchema)
module.exports = User;