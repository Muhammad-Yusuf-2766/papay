const Product = require("../models/Product")
const assert = require("assert");
const Definer = require("../lib/mistake");
const { Script } = require("vm");

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
        console.log(req.files);
        assert(req.files, Definer.general_err3);

        const product = new Product();
        let data = req.body;

        data.product_images = req.files.map(ele =>{
            return ele.path.replace(/\\/g, "/");
        });
        console.log(data);

        const result = await product.addNewProductData(data, req.member);

        const html = `<script>
                        alert('new dish added successfully');
                         window.location.replace('/resto/products/menu')
                     </script>`;
        res.end(html);

    } catch (err) {
        console.log(`ERROR: Contr/addNewProduct, ${err.message}`);
    }
}

productController.updateChosenProduct = async (req, res) => {
    try{
        console.log("POST: Contr/updateChosenProduct");
        const product = new Product();
        const id = req.params.id;
        const result = await product.updateChosenProductData(id, req.body, req.member._id);
        res.json({state: "success", data: result})
    } catch (err) {
        console.log(`ERROR: Contr/updateChosenProduct, ${err.message}`);
        res.json({state:"fail", message: err.message})
    }
}