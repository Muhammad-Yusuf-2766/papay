const Member = require("../models/Member");
const { signup } = require("./memberContr");
let restaurantController = module.exports;

restaurantController.getSignupMyRestaurant = async (req, res) => {
    try{
        console.log("GET: contr/getSignupMyRestaurant");
        res.render("signup");

    }catch(err){
        console.log(`ERROR: contr/getSignupMyRestaurant ${err.message}`);
        res.json({state:"failed", message:err.message});
    }
}

restaurantController.signupProcess = async (req, res) =>{
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

restaurantController.getLoginMyRestaurant = async (req, res) => {
    try{
        console.log("GET: contr/getLoginMyRestaurant");
        res.render("login");

    }catch(err){
        console.log(`ERROR: contr/getLoginMyRestaurant ${err.message}`);
        res.json({state:"failed", message:err.message});
    }
}

restaurantController.loginProcess = async (req, res) =>{
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

restaurantController.logout = (req, res) =>{
    console.log("GET controller.logout")
    res.send("You are in logout")
};