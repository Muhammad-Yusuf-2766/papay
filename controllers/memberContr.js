const Member = require("../models/Member");

let memberController = module.exports;

memberController.signup = async (req, res) =>{
    try{
        console.log("POST: contr/sign-up")
        const data = req.body;
        const member = new Member();
        const new_member = await member.singupData(data);

        res.send("done")
    }catch (err) {
        console.log(`ERROR: contr/sign-up`, err)
    }
};

memberController.login = (req, res) =>{
    console.log("POST controller.login")
    res.send("You are in login-page")
};

memberController.logout = (req, res) =>{
    console.log("GET controller.logout")
    res.send("You are in logout")
};