const express = require("express");
const router = express.Router();
const memberController = require("./controllers/memberContr")
const productController = require('./controllers/products.Contr')
const restaurantController = require('./controllers/restaurantContr')
const orderController = require('./controllers/orderContr')
const uploader_community = require('./utils/upload-multer')("community")
const uploader_member = require('./utils/upload-multer')("members")
const communityController = require('./controllers/communityContr');


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
router.get('/restaurants/:id', 
  memberController.retrieveAuthMember,
  restaurantController.getChosenRestaurant
)


// Orders related Routers
router.post("/orders/create", memberController.retrieveAuthMember, orderController.createOrder)
router.get('/orders', memberController.retrieveAuthMember, orderController.getMyOrders)
router.post('/orders/edit', memberController.retrieveAuthMember, orderController.editChosenOrder)


// Community related Routers 
router.post('/community/image',
 uploader_community.single('community_image'), communityController.imageInsertion)
router.post("/community/create",
 memberController.retrieveAuthMember,
 communityController.createArticle)

module.exports = router