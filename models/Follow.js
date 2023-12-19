const assert = require("assert");
const { shapeIntoMongooseObjectId, lookup_auth_memebr_following } = require("../lib/config");
const FollowModel = require("../schema/follow.model");
const Definer = require("../lib/mistake");
const MemberModel = require("../schema/member.model");
const { exec } = require("child_process");
const { lookup } = require("dns");

class Follow {
  constructor() {
    this.followModel = FollowModel;
    this.memberModel = MemberModel;
  }

  async subscribeData(member, data) {
    try {
      assert.ok(member._id !== data.mb_id, Definer.follow_err1);

      const subscriber_id = shapeIntoMongooseObjectId(member._id);
      const follow_id = shapeIntoMongooseObjectId(data.mb_id);

      const member_data = await this.memberModel
        .findById({ _id: follow_id })
        .exec();
      assert.ok(member_data, Definer.gen2);

      const result = await this.createSubscriptionData(
        follow_id,
        subscriber_id
      );
      assert.ok(result, Definer.general_err1);

      await this.modifyMemberFollowCounts(follow_id, "subscriber_change", 1);
      await this.modifyMemberFollowCounts(subscriber_id, "follow_change", 1);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async createSubscriptionData(follow_id, subscriber_id) {
    try {
      const new_follow = this.followModel({
        follow_id: follow_id,
        subscriber_id: subscriber_id,
      });
      return await new_follow.save();
    } catch (error) {
      console.log(error);
      throw new Error(Definer.follow_err2);
    }
  }

  async modifyMemberFollowCounts(mb_id, type, modifier) {
    try {
      if (type === "follow_change") {
        await this.memberModel
          .findByIdAndUpdate(
            { _id: mb_id },
            { $inc: { mb_follow_cnt: modifier } }
          )
          .exec();
        return true;
      } else if (type === "subscriber_change") {
        await this.memberModel.findByIdAndUpdate(
          { _id: mb_id },
          { $inc: { mb_subscriber_cnt: modifier } }
        );
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  async unSubscribeData(member, data) {
    try {
      const subscriber_id = shapeIntoMongooseObjectId(member._id);
      const follow_id = shapeIntoMongooseObjectId(data.mb_id);

      const result = await this.followModel.findOneAndDelete({
        follow_id: follow_id,
        subscriber_id: subscriber_id,
      });
      assert.ok(result, Definer.general_err1);

      await this.modifyMemberFollowCounts(follow_id, "subscriber_change", -1);
      await this.modifyMemberFollowCounts(subscriber_id, "follow_change", -1);

      return true;
    } catch (error) {
      throw error;
    }
  }

  async getMemberFollowingsData(inquery) {
    try {
      console.log("Query_data:::", inquery);
      const subscriber_id = shapeIntoMongooseObjectId(inquery.mb_id),
        page = inquery.page * 1, // bu amal page stingni ichdagi numberni Number o'zgarruvchiga o'zgartirish uchun.
        limit = inquery.limit * 1; // boshqa usul: limit = parseInt(inquery.limit)

      const result  = await this.followModel.aggregate([
        {$match: {subscriber_id: subscriber_id}},
        {$sort: {createdAt: -1}},
        {$skip: (page - 1) * limit},
        {$limit: limit},
        {
          $lookup: {
            from: 'members',
            localField: "follow_id",
            foreignField: "_id",
            as: 'follow_member_data'
          }
         },
         {$unwind: "$follow_member_data"}
      ])
      .exec()

      assert.ok(result, Definer.follow_err3)
      return result
    } catch (error) {
      throw error;
    }
  }

  async getMemberFollowersData(member, inquery) {
    try {
      const follow_id = shapeIntoMongooseObjectId(inquery.mb_id)
      const page = inquery.page * 1
      const limit = inquery.limit * 1

      let aggregateQuery = [
        {$match: {follow_id}},
        {$sort: {createdAt: -1}},
        {$skip: (page - 1) * limit},
        {$limit: limit},
        {$lookup: {
          from: 'members',
          localField: 'subscriber_id',
          foreignField: '_id',
          as: 'subscriber_member_data'
        }},
        {$unwind: '$subscriber_member_data'}
      ]

      // Following followed back to subscriber
      if(member && member._id === inquery.mb_id) {
        aggregateQuery.push(lookup_auth_memebr_following(follow_id))
      }

      const result = await this.followModel.aggregate(aggregateQuery)
      .exec()

      assert.ok(result, Definer.follow_err3)
      return result
    } catch (error) {
      throw   error
    }
  }

}
module.exports = Follow;
