const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  token: {
    type: String,
    required: [true, "Please enter your token"],
  },
 
});
module.exports = mongoose.model("TokenSet", schema);
