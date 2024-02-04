const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/Backend");

const pageSchema = mongoose.Schema({
    pagetitle:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    content:{
        type: Array,
        default:[]
    },
    ispublished:{
        type:Boolean,
        required:true
    },
    id: {
        type: String,
        required:true
    }
},{
    timestamps: true
})


module.exports = mongoose.model("pageModel", pageSchema);