const User = require("../model/user.js");

const getAllUser=async(req,res)=>{
    try {
        const users=await User.find();
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({
            message:"error getting users"
        })
    }
}

const blockUnblockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const block_or_unblock = req.body;
    console.log(block_or_unblock.block_or_unblock);
    const user = await User.find({ userId });
    if (!user) {
      return res.status(404).json({ message: "no such user" });
    }
    await User.updateOne(
      { userId },
      { $set: { isBlocked: block_or_unblock.block_or_unblock } }
    );
    res.status(201).json({ message: "blocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error blocking users!" });
  }
};
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Use findById to find a user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "No such user" });
    }

    // Delete the user
    await User.deleteOne({ _id: userId });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user!" });
  }
};

module.exports = { getAllUser, blockUnblockUser, deleteUser };