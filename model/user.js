const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "Please enter your userid"],
  },
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  userCity: {
    type: String,
    required: [true, "Please enter your city"],
  },
  subscribed: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("User",schema);


