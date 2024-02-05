const mongoose = require("mongoose");

const connectMongoose = async () => {
  try {
    const connect = await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Error Connecting to the database");
  }
};

module.exports = connectMongoose;
