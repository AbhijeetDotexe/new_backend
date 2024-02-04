const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/Backend");
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },

    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('userModel', userSchema);