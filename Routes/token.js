const express = require("express");
const { updateToken, getToken } = require("../Controller/tokenController");
const router = express.Router();
router.route("/get-token").get(getToken);
router.route("/update/:id").put(updateToken);
module.exports = router;
