const assert = require("assert");
const { shapeIntoMongooseObjectId,product_collection_enums, lookup_auth_member_liked } = require("../lib/config");
const ProductModel = require("../schema/product.model");
const Definer = require("../lib/mistake");
const Member = require("./Member");

class Product {
    constructor() {
        this.productModel = ProductModel;
    };

  //  Product Controleler methods related to user REact APIs //
   async getgetAllProductsData(member, data) {
    try {
        const auth_mb_id = shapeIntoMongooseObjectId(member?._id)

        let match = {product_status: "PROCESS"}
        if(data.restaurant_mb_id) {
            match['restaurant_mb_id'] = shapeIntoMongooseObjectId(data.restaurant_mb_id);
            match['product_collection'] = data.product_collection
        }

        const sort = data.order === 'product_price' 
        ? {[data.order]: 1}
        : {[data.order]: -1}

        const result = await this.productModel.aggregate([
            {$match: match},
            {$sort: sort},
            {$skip: (data.page * 1 - 1 ) * data.limit},
            {$limit: data.limit * 1},
            //  TODO: check auth member product-likes
            lookup_auth_member_liked(auth_mb_id),
        ])
        .exec()

        assert.ok(result, Definer.general_err1)
        return result;

    } catch (error) {
        throw error
    }
   }

   async getChosenProductData (member, id) {
    try {
        const auth_mb_id = shapeIntoMongooseObjectId(member?._id)
        id = shapeIntoMongooseObjectId(id);

        if(member) {
            const member_obj = new Member()
            await member_obj.viewChosenItemByMember(member, id, 'product')
        }

        const result = await this.productModel.aggregate([
            { $match: { _id: id, product_status: "PROCESS" } },
            lookup_auth_member_liked(auth_mb_id),
          ])
          .exec();

        assert.ok(result, Definer.general_err1)
        return result
    } catch (error) {
        throw error
    }
   }
  



//  Product Controller methods related to BSSR ADMIN //
    async getAllProductsDataResto(member) {
        try{
            member._id = shapeIntoMongooseObjectId(member._id);
            const result = await this.productModel.find({
                restaurant_mb_id: member._id
            });

            assert.ok(result, Definer.general_err1);
            // console.log("Result::", result); // console da natijani tekshirish. o'zim uchun
            return result;
        }catch(err){
            throw err
        }
    }

    async addNewProductData(data, member) {
        try{
            data.restaurant_mb_id = shapeIntoMongooseObjectId(member._id);

            const new_product = new this.productModel(data);
            const result = await new_product.save();

            assert(result, Definer.product_err1);
            return result;
            
        }catch(err) {
            throw err
        }
    }

    async updateChosenProductData(id, updated_data, mb_id) {
        try{
         id = shapeIntoMongooseObjectId(id);
         mb_id = shapeIntoMongooseObjectId(mb_id);

            const result = await this.productModel
            .findOneAndUpdate(
                {_id: id, restaurant_mb_id: mb_id},
                updated_data,
                { runValidators: true, lean: true, returnDocument: 'after'}
            ).exec();

            assert(result, Definer.general_err1);
            return result;

        }catch(err) {
            throw err
        }
    }
};

module.exports = Product;