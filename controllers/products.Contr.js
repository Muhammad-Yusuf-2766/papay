let productController = module.exports;

productController.getAllProducts = async (req, res) => {
    try{
        console.log("GET: Contr/getAllProducts");
    } catch (err) {
        console.log(`ERROR: Contr/getAllProducts, ${err.message}`);
        res.json({state:"fail", message: err.message})
    }
}

productController.addNewProduct = async (req, res) => {
    try{
        console.log("POST: Contr/addNewProduct");
        // TODO: product creation develop
        res.send("Ok")
        
    } catch (err) {
        console.log(`ERROR: Contr/addNewProduct, ${err.message}`);
    }
}

productController.updateChosenProduct = async (req, res) => {
    try{
        console.log("POST: Contr/updateChosenProduct");
    } catch (err) {
        console.log(`ERROR: Contr/updateChosenProduct, ${err.message}`);
    }
}