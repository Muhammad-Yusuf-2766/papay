const Order = require("../models/Order");
const Member = require("../models/Member");

let orderController = module.exports;
const assert = require("assert");
const Definer = require("../lib/mistake");

orderController.createOrder = async (req, res) => {
  try {
    console.log("POST: Order_contr/createOrder");
    assert.ok(req.member, Definer.auth_err5);
    console.log(req.body); //checking request.body data

    const order = new Order();
    const result = await order.createOrderData(req.member, req.body);

    res.json({ state: "succed", data: result });
  } catch (err) {
    console.log(`ERROR: Order_contr/createOrder`, err);
    res.json({ state: "failed", message: err.message });
  }
};


orderController.getMyOrders = async (req, res) => {
  try {
    console.log("GET: Order_contr/getMyOrders");
    assert.ok(req.member, Definer.auth_err5)

    const order = new Order()
    const result = await order.getMyOrdersData(req.member, req.query)

    res.json({ state: "succed", data: result });
  } catch (error) {
    console.log(`ERROR: Order_contr/getMyOrders`, error);
    res.json({ state: "failed", message: error.message });
  }
}

orderController.editChosenOrder = async (req, res) => {
  try {
    console.log("POST: Order_contr/editChosenOrder")
    assert.ok(req.member, Definer.auth_err5)

    const order = new Order()
    const result = await order.editChosenOrderData(req.member, req.body)
    
    res.json({ state: "succed", data: result });
  } catch (error) {
    console.log(`ERROR: Order_contr/editChosenOrder`, error);
    res.json({ state: "failed", message: error.message });
  }
}