const Member = require("../models/Member");
let memberController = module.exports;

memberController.signup = async (req, res) =>{
    try{
        console.log("POST: contr/sign-up")
        const data = req.body;
        const member = new Member();
        const new_member = await member.singupData(data);

        res.json({state:"succed", data:new_member})
    }catch (err) {
        console.log(`ERROR: contr/sign-up`, err)
        res.json({state:"failed", message:err.message})
    }
};

memberController.login = async (req, res) =>{
    try{
        console.log("POST: contr/login")
        const data = req.body;
        const member = new Member();
        const result = await member.loginData(data);

        res.json({state:"succed", data:result})
    }catch (err) {
        console.log(`ERROR: contr/login`, err)
        res.json({state:"failed", message:err.message})
    }
};

memberController.logout = (req, res) =>{
    console.log("GET controller.logout")
    res.send("You are in logout")
};