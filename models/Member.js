const MemberModel = require("../schema/member.model");
const Definer = require("../lib/mistake");
const assert = require("assert");
const bcrypt = require("bcryptjs");
const {
  shapeIntoMongooseObjectId,
  lookup_auth_member_following,
  lookup_auth_member_liked
} = require("../lib/config");
const View = require("./Views");
const Like = require("./Like");
const {lookup} = require('dns')

class Member {
  constructor() {
    this.memberModel = MemberModel;
  }
  async singupData(input) {
    try {
      const salt = await bcrypt.genSalt();
      input.mb_password = await bcrypt.hash(input.mb_password, salt);
      const new_member = this.memberModel(input);

      let result;
      try {
        result = await new_member.save();
      } catch (mongo_err) {
        console.log(mongo_err);
        throw new Error(Definer.mongo_validation_err1);
      }

      // result.mb_password = "";
      return result;
    } catch (err) {
      throw err;
    }
  }

  async loginData(input) {
    try {
      const member = await this.memberModel
        .findOne({ mb_nick: input.mb_nick }, { mb_nick: 1, mb_password: 1 })
        .exec();

      assert.ok(member, Definer.auth_err3);

      const isMatch = await bcrypt.compare(
        input.mb_password,
        member.mb_password
      );
      assert.ok(isMatch, Definer.auth_err4);

      return await this.memberModel
        .findOne({
          mb_nick: input.mb_nick,
        })
        .exec();
    } catch (err) {
      throw err;
    }
  }
  async getChosenMemberData(member, id) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member._id);
      id = shapeIntoMongooseObjectId(id);
      console.log("request member:::", member);

      let aggregateQuery = [
        { $match: { _id: id, mb_status: "ACTIVE" } },
        { $unset: "mb_password" },
      ];

      // condition: if not seen before by req user
      if (member) {
        await this.viewChosenItemByMember(member, id, "member");
        //    ToDo: Check auth member liked chosen target or not
        aggregateQuery.push(lookup_auth_member_liked(auth_mb_id));
        aggregateQuery.push(
          lookup_auth_memebr_following(auth_mb_id, "members")
        );
      }

      const result = await this.memberModel
        .aggregate(aggregateQuery)
        // to check  follow back qilganmizmi .. 
        .exec();
        console.log("result:::", result);

      assert.ok(result, Definer.general_err2);
      return result[0];
    } catch (error) {
      throw error;
    }
  }

  async viewChosenItemByMember(member, view_ref_id, group_type) {
    try {
      view_ref_id = shapeIntoMongooseObjectId(view_ref_id);
      const mb_id = shapeIntoMongooseObjectId(member._id);

      const view = new View(mb_id);
      // doing validation
      const isValid = await view.validateChosenTarget(view_ref_id, group_type);
      console.log("isValid:::", isValid);

      assert.ok(isValid, Definer.general_err2);

      // has logged user seen target before ?
      const doesExist = await view.checkViewExistence(view_ref_id);
      console.log("doesExist:::", doesExist);

      if (!doesExist) {
        const result = await view.insertMemberView(view_ref_id, group_type);
        assert.ok(result, Definer.general_err1);
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  async likeChosenItemByMember(member, like_ref_id, group_type) {
    try {
      like_ref_id = shapeIntoMongooseObjectId(like_ref_id);
      const mb_id = shapeIntoMongooseObjectId(member._id);

      const like = new Like(mb_id);
      const isValid = await like.validateTargetItem(like_ref_id, group_type);
      console.log("isValid::::", isValid);
      assert.ok(isValid, Definer.general_err2);

      //doesExist
      const doesExist = await like.checkLikeExistence(like_ref_id);
      console.log("doesexist::::", doesExist);

      let data = doesExist
        ? await like.removeMemberLike(like_ref_id, group_type)
        : await like.insertMemberLike(like_ref_id, group_type);
      assert.ok(data, Definer.generel_err1);

      const result = {
        like_group: data.like_group,
        like_ref_id: like_ref_id,
        like_status: doesExist ? 0 : 1
      };
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Member;
