const express = require("express");
const router = express.Router();
const memberController = require("./controllers/memberContr")
const productController = require('./controllers/products.Contr')
const restaurantController = require('./controllers/restaurantContr')

// ==========================================
//                REST API       
// ==========================================
// Member related Routers
router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
router.get("/logout", memberController.logout);
router.get("/check-me", memberController.checkMyAuthentication)
router.get(
    '/member/:id', 
      memberController.retrieveAuthMember,
      memberController.getChosenMember
)


//  Product related Routers
router.post("/products",  
  memberController.retrieveAuthMember, 
  productController.getAllProducts  
)
router.get('/products/:id', 
  memberController.retrieveAuthMember,
  productController.getChosenProduct
) 

//  Restaurant related Routers
router.get('/restaurants', 
  memberController.retrieveAuthMember,
  restaurantController.getRestaurants
  )

module.exports = router