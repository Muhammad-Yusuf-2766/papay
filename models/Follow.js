const assert = require("assert");
const { shapeIntoMongooseObjectId } = require("../lib/config");
const FollowModel = require("../schema/follow.model");
const Definer = require("../lib/mistake");
const MemberModel = require("../schema/member.model");
const { exec } = require("child_process");

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
         await this.memberModel.findByIdAndUpdate(
          { _id: mb_id },
          { $inc: { mb_follow_cnt: modifier } }
        )
        .exec()
      } else if (type === "subscriber_change") {
        await this.memberModel.findByIdAndUpdate(
            { _id: mb_id },
            { $inc: { mb_subscriber_cnt: modifier } }
          )
      }
      return true
    } catch (error) {
      throw error;
    }
  }
}
module.exports = Follow;
