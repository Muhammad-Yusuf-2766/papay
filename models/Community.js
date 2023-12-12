const BoArticleModel = require("../schema/bo_article.model")
const Definer = require("../lib/mistake");
const assert = require("assert");
const bcrypt = require('bcryptjs');
const { shapeIntoMongooseObjectId } = require("../lib/config");
const View = require("./Views");

class Community {
    constructor() {
        this.boArticleModel = BoArticleModel
    }

    async createArticleData(member, data) {
        try {
            data.mb_id = shapeIntoMongooseObjectId(member._id) 
            const new_article = await this.saveArticleData(data)
            return new_article
        } catch (error) {
            throw error
        }
    }

    async saveArticleData (data) {
        try {
            const article = new this.boArticleModel(data)
            return await article.save()
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}

module.exports = Community;