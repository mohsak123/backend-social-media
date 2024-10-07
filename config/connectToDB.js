const mongoose = require("mongoose");

module.exports = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("connect to mongodb is successfully");
  } catch (error) {
    console.log("connection failed to mongodb", error);
  }
};
