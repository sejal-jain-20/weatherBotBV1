const TokenSet = require("../model/token.js");

const seedToken = async () => {
  const newToken = process.env.TOKEN;
  try {
    await TokenSet.create({ token: newToken });
    console.log("Token seeded successfully!");
  } catch (error) {
    console.log(error);
  }
};

const updateToken = async (req, res) => {
  const tokenId = req.params.id; // Assuming the token ID is in the params
  const newToken = req.body.token;

  if (!newToken) {
    return res.status(400).json({
      message: "No token provided",
    });
  }

  try {
    // Assuming your Token model has a method named 'findByIdAndUpdate'
    const updatedToken = await TokenSet.findByIdAndUpdate(
      tokenId,
      { token: newToken },
      { new: true }
    );
    return res.status(200).json({
      message: "Token updated successfully",
      updatedToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getToken = async (req, res) => {
  try {
    let token = await TokenSet.find();
    return res.send(token);
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};
module.exports = { seedToken, updateToken, getToken };
