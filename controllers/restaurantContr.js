const assert = require("assert");
const Member = require("../models/Member");
const Product = require("../models/Product");
   

const { signup } = require("./memberContr");
const Definer = require("../lib/mistake");
const Restaurant = require("../models/Restaurant");
let restaurantController = module.exports;

    /*********************************************************
    *   Restaurant member and Admin APIs  related to BSSR    *
    **********************************************************/

restaurantController.home = (req, res) => {
    try {
        console.log('GET: cont/home');
        res.render("home-page");
    } catch (err) {
        console.log (`ERROR, cont/getMyRestaurantProducts, ${err.message}`);
        res.json({state: "fail", message: err.message});
    }
}


restaurantController.getMyRestaurantProducts = async (req, res) => {
    try{
        console.log("GET: contr/getMyRestaurantProducts");
        // TODO. GET my restaurant products.
        const product = new Product();
        const data = await product.getAllProductsDataResto(res.locals.member);
        
        res.render("restaurant-menu", {restaurant_data: data})
    }catch(err){
        console.log(`ERROR: contr/getMyRestaurantProducts ${err.message}`);
        // if(!req.session.member) {
        //     res.redirect("/resto/login")
        // }
        res.redirect("/resto")
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
        console.log("POST: contr/sign-up-Process")
        console.log(req.body)
        console.log(req.file)
        assert(req.file, Definer.general_err3)


        let new_member = req.body;
        new_member.mb_type = 'RESTAURANT'
        new_member.mb_image = req.file.path

        const member = new Member();
        const result = await member.singupData(new_member);
        assert(result, Definer.general_err1)

        req.session.member = result ;
        res.redirect("/resto/products/menu");

    }catch (err) {
        console.log(`ERROR: contr/sign-up-Process`, err)
        res.json({state:"failed", message:err.message})
    }
};

restaurantController.getLoginMyRestaurant = async (req, res) => {
    try{
        console.log("GET: contr/getLoginMyRestaurant");
        res.render("login-page");

    }catch(err){
        console.log(`ERROR: contr/getLoginMyRestaurant ${err.message}`);
        res.json({state:"failed", message:err.message});
    }
}

restaurantController.loginProcess = async (req, res) =>{
    try{
        console.log("POST: contr/login-Process")
        const data = req.body;
        const member = new Member();
        const result = await member.loginData(data);

        req.session.member = result;
        req.session.save(function (){
           result.mb_type === 'ADMIN' 
           ? res.redirect("/resto/all-restaurant")
           : res.redirect("/resto/products/menu");
        });
        
    }catch (err) {
        console.log(`ERROR: contr/login-Process`, err)
        res.json({state:"failed", message:err.message})
    }
};

restaurantController.validateAuthRestaurant = (req, res, next) =>{
    if(req.session?.member?.mb_type === "RESTAURANT"){
        req.member = req.session.member
        next()
    }else res.json({state:"fail", message:"Only authenticated members with restaurant type"})
}


restaurantController.logout = (req, res) =>{
    try{
      console.log("GET controller.logout")
      req.session.destroy(function() {
        res.redirect("/resto")
      })
    } catch (err) {
        console.log("ERROR: CONTR/Log-out", err.message)
        res.json({state: "fail", message: err.message})
    }
    
};

restaurantController.checkSessions = (req, res) =>{
    if(req.session.member){
        console.log(`User: ${req.session.member.mb_nick}'s session is checked:`)
        res.json({state:"succeed", data: req.session.member});
    }else{
        res.json({state:"fail", message:"you are not authenticated"})
    }
};


restaurantController.validateAdmin = (req, res, next) => {
    if (req.session?.member?.mb_type === "ADMIN") {
        req.member = req.session.member;
        next();
    } else {
        const html = `<script>
              alert('Admin page: Permission denied!');
              window.location.replace('/resto');
            </script>`;
        res.end(html);
    }
};



restaurantController.getAllRestaurants = async (req, res) => {
    try{
        console.log("GET: CONTR/getAllRestaurants")

      const restaurant = new Restaurant();
      const restaurants_data = await restaurant.getAllRestaurantsData()
      console.log("restos_data:", restaurants_data)

        res.render('all-restaurants', {restaurants_data: restaurants_data})

    } catch (err) {
        console.log("ERROR: CONTR/getAllRestaurants", err.message)
        res.json({state: "fail", message: err.message})
    }
}



restaurantController.updateRestaurantByAdmin = async (req, res) => {
    try{
        console.log("GET: CONTR/updateRestaurantByAdmin")

        const restaurant = new Restaurant();
        const result = await restaurant.updateRestaurantByAdminData(req.body)
        await res.json({state:'success', data: result })

    } catch (err) {
        console.log("ERROR: CONTR/getAllRestaurants", err.message)
        res.json({state: "fail", message: err.message})
    }
}


    /*****************************************************
    *        USers APIs  related to REACT pages          *
    *****************************************************/ 
   restaurantController.getRestaurants = async (req, res) => {
    try {
        console.log("GET: CONTR/getRestaurants")
        const data = req.query;
        console.log('query data:::>', data)
        const restaurant = new Restaurant()
        const result = await restaurant.getRestaurantsData(req.member, data)
        res.json({state: 'Succeed', data: result })
    } catch (error) {
        console.log("ERROR: CONTR/getRestaurants", error.message)
        res.json({state: "fail", message: error.message})
    }
   }