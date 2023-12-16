const assert = require("assert");
const Definer = require("../lib/mistake");
const Follow = require("../models/Follow");

let followController = module.exports;

followController.subscribe = async (req, res) => {
  try {
    console.log("POST: followCont/subscribe");
    assert.ok(req.member, Definer.auth_err5);

    const follow = new Follow();
    const result = await follow.subscribeData(req.member, req.body);

    res.json({ state: "succed", data: "Subscribed", result });
  } catch (error) {
    console.log(`ERROR, followCont/subscribe, ${error.message}`);
    res.json({ state: "fail", message: error.message });
  }
};

followController.unSubscribe = async (req, res) => {
  try {
    console.log("POST: followCont/unsubscribe");
    assert.ok(req.member, Definer.auth_err5);

    const follow = new Follow()
    const result = await follow.unSubscribeData(req.member, req.body)

    res.json({ state: "succed", data: "Subscription is Canceled", result });
  } catch (error) {
    console.log(`ERROR, followCont/unsubscribe, ${error.message}`);
    res.json({ state: "fail", message: error.message });
  }
};
