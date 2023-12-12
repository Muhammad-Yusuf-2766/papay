const assert = require("assert");
const Definer = require("../lib/mistake");
const Community = require("../models/Community");

let communityController = module.exports

communityController.imageInsertion = async (req, res) => {
    try {
        console.log("POST: community_Contr/imageInsertion");
        assert.ok(req.file, Definer.general_err3)
        const image_url = req.file.path;

        res.json({state: 'success', data: image_url})
    } catch (error) {
        console.log(`ERROR: community_Contr/imageInsertion`, error);
    res.json({ state: "failed", message: error.message });
    }
}

communityController.createArticle = async (req, res) => {
    try {
        console.log("POST: community_Contr/createArticle");
        const community = new Community()
        const result = await community.createArticleData(req.member, req.body)
        assert.ok(result, Definer.general_err1)

        res.json({state: 'Success', data: result})
    } catch (error) {
        console.log(`ERROR: community_Contr/createArticle`, error);
    res.json({ state: "failed", message: error.message });
    }
}