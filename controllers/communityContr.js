const assert = require("assert");
const Definer = require("../lib/mistake");
const Community = require("../models/Community");

let communityController = module.exports;

communityController.imageInsertion = async (req, res) => {
  try {
    console.log("POST: community_Contr/imageInsertion");
    assert.ok(req.file, Definer.general_err3);
    const image_url = req.file.path;

    res.json({ state: "success", data: image_url });
  } catch (error) {
    console.log(`ERROR: community_Contr/imageInsertion`, error);
    res.json({ state: "failed", message: error.message });
  }
};

communityController.createArticle = async (req, res) => {
  try {
    console.log("POST: community_Contr/createArticle");
    const community = new Community();
    const result = await community.createArticleData(req.member, req.body);
    assert.ok(result, Definer.mongo_validation_err1);

    res.json({ state: "Success", data: result });
  } catch (error) {
    console.log(`ERROR: community_Contr/createArticle`, error);
    res.json({ state: "failed", message: error.message });
  }
};

communityController.getMemberArticles = async (req, res) => {
  try {
    console.log("GET: cont/getMemberArticles");

    const community = new Community();
    const mb_id =
      req.query.mb_id !== "none" ? req.query.mb_id : req.member?._id;
    assert.ok(mb_id, Definer.article_err1);
    const result = await community.getMemberArticlesData(
      req.member,
      mb_id,
      req.query
    );

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getMemberArticles, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

communityController.getArticles = async (req, res) => {
  try {
    console.log("GET: cont/getArticles");
    // console.log("req.query:::", req.query);
    const community = new Community();

    const result = await community.getArticlesData(req.member, req.query);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getArticles, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};


communityController.getChosenArticle  = async (req, res) => {
  try {
    console.log("GET: communityCont/getChosenArticle");
    const art_id = req.params.art_id
    // console.log("art_id:::", art_id);
    const community = new Community();
    const result = await community.getChosenArticleData(req.member, art_id);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR,  communityCont/getChosenArticle, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
}