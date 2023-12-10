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
