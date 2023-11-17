const express = require("express");
const {
  getAllUser,
  blockUnblockUser,
  deleteUser,
} = require("../Controller/userController");
const router = express.Router();
router.route("/users").get(getAllUser);
router.route("/block/:id").put(blockUnblockUser);
router.route("/delete/:id").delete(deleteUser);

module.exports = router;
