const express = require("express");
const router = express.Router();
const memberController = require("./controllers/memberContr")

// ==========================================
//                REST API       
// ==========================================

router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
router.get("/logout", memberController.logout);
router.get("/check-me", memberController.checkMyAuthentication)


router.get("/menu", (req, res) => {
    res.send("You are in Menu-page")
});

router.get("/community", (req, res) => {
    res.send("You are in community-page")
});

module.exports = router