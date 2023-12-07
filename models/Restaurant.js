const assert = require("assert");
const Definer = require("../lib/mistake");
const MemberModel = require("../schema/member.model");
const { shapeIntoMongooseObjectId } = require("../lib/config");
const Member = require("./Member");

class Restaurant {
  constructor() {
    this.memberModel = MemberModel;
  }

  async getRestaurantsData(member, data) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      let match = { mb_type: "RESTAURANT", mb_status: "ACTIVE" };
      let aggregationQuery = [];
      data.limit = data["limit"] * 1; //req.query dan kelayotgan objectdagi limit va page argumentlarining value si stringda kelyapti. Bu code orqali uni stringdan numberga o'zgartirvolyapmiz.
      data.page = data["page"] * 1;

      switch (data.order) {
        case "top":
            match['mb_top'] = 'Y'
            aggregationQuery.push({$match: match})
            aggregationQuery.push({$sample: {size: data.limit}}) //bu yerda agregationning sample methodi orqali top_res lar ichidan random restaurantlarni olib beradigan qildik
          break;
        case "random":
            aggregationQuery.push({$match: match})
            aggregationQuery.push({$sample: {size: data.limit}})
            
            break;
        default:
            aggregationQuery.push({$match: match})
            const sort = {[data.order]: -1}
            aggregationQuery.push({$sort: sort})
            break;
      }

      aggregationQuery.push({$skip: (data.page - 1) * data.limit})
      aggregationQuery.push({$limit: data.limit})

    //    ToDo: Check auth Member liked chosen target or not

    const result = await this.memberModel
      .aggregate(aggregationQuery)
      .exec()
      assert.ok(result, Definer.general_err1)
      return result

    } catch (error) {
      throw error;
    }
  }


  async getChosenRestaurantData(member, id) {
    try {
        id = shapeIntoMongooseObjectId(id)
        // condition: if not seen before by req user
        if(member) {
            const member_obj = new Member
            await member_obj.viewChosenItemByMember(member, id, 'member')
        }

        const result = await this.memberModel.findOne({
            _id: id,
            mb_status: "ACTIVE"
        }).exec()
        assert.ok(result, Definer.general_err2)
        return result

        // increase target_view if member has not seen  before
    } catch (error) {
        throw error
    }
  }


  /*********************************************************
    *   Restaurant member and Admin APIs  related to BSSR    *
    **********************************************************/

  async getAllRestaurantsData() {
    try {
      const result = await this.memberModel
        .find({ mb_type: "RESTAURANT" })
        .exec();

      assert(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateRestaurantByAdminData(update_data) {
    try {
      const id = shapeIntoMongooseObjectId(update_data?.id);
      const result = await this.memberModel
        .findByIdAndUpdate({ _id: id }, update_data, {
          runValidators: true,
          lean: true,
          returnDocument: "after",
        })
        .exec();

      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Restaurant;
