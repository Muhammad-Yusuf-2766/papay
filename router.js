const express = require("express");
const router = express.Router();
const memberController = require("./controllers/memberContr")
const productController = require('./controllers/products.Contr')

// ==========================================
//                REST API       
// ==========================================
// member ga oid REST API lar
router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
router.get("/logout", memberController.logout);
router.get("/check-me", memberController.checkMyAuthentication)
router.get(
    '/member/:id', 
      memberController.retrieveAuthMember,
      memberController.getChosenMember
)


//  Product ga oid REST API lar
router.post("/products",  
  memberController.retrieveAuthMember, 
  productController.getAllProducts  
)
router.get('/products/:id', 
  memberController.retrieveAuthMember,
  productController.getChosenProduct
)

module.exports = router