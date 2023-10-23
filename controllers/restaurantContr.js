const Member = require("../models/Member");
const { signup } = require("./memberContr");
let restaurantController = module.exports;

restaurantController.getMyRestaurantData = async (req, res) => {
    try{
        console.log("GET: contr/getMyRestaurantData");
        // TODO. GET my restaurant products.
        res.render("restaurant-menu")
    }catch(err){
        console.log(`ERROR: contr/getMyRestaurantData ${err.message}`);
        res.json({state:"failed", message:err.message});
    }
}


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

        req.session.member = new_member;
        res.redirect("/resto/products/menu");

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

        req.session.member = result;
        req.session.save(function (){
            res.redirect("/resto/products/menu")
        });
        
    }catch (err) {
        console.log(`ERROR: contr/login`, err)
        res.json({state:"failed", message:err.message})
    }
};


restaurantController.logout = (req, res) =>{
    console.log("GET controller.logout")
    res.send("You are in logout")
};

restaurantController.checkSessions = (req, res) =>{
    if(req.session.member){
        console.log(`User: ${req.session.member.mb_nick}'s session is checked:`)
        res.json({state:"succeed", data: req.session.member});
    }else{
        res.json({state:"fail", message:"you are not authenticated"})
    }
};