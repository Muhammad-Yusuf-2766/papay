const MemberModel = require("../schema/member.model");
const ViewModel = require("../schema/views.mode");
const ProductModel = require("../schema/product.model");

class View {
  constructor(mb_id) {
    this.viewModel = ViewModel;
    this.mb_id = mb_id;
    this.memberModel = MemberModel;
    this.productModel = ProductModel;
  }

  async validateChosenTarget(view_ref_id, group_type) {
    try {
      let result;
      switch (group_type) {
        case "member":
          result = await this.memberModel
            .findOne({
              _id: view_ref_id,
              mb_status: "ACTIVE",
            })
            .exec();
          break;
        case "product":
          result = await this.productModel
            .findOne({
              _id: view_ref_id,
              product_status: "PROCESS",
            })
            .exec();
          break;
      }

      return !!result; // bu qator result mavjud bo'lsa true bo'lmasa false qaytar degani
    } catch (error) {
      throw error;
    }
  }

  async insertMemberView(view_ref_id, group_type) {
    try {
      const new_view = this.viewModel({
        mb_id: this.mb_id,
        view_ref_id: view_ref_id,
        view_group: group_type,
      });
      const result = await new_view.save();
      //  target item view sonini bittaga oshiramiz
      await this.modifyItemViewCounts(view_ref_id, group_type);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async modifyItemViewCounts(view_ref_id, group_type) {
    try {
      switch (group_type) {
        case "member":
          await this.memberModel
            .findOneAndUpdate(
              {
                _id: view_ref_id,
              },
              { $inc: { mb_views: 1 } }
            )
            .exec();
          break;
        case "product":
          await this.productModel
            .findOneAndUpdate(
              {
                _id: view_ref_id,
              },
              { $inc: { product_views: 1 } }
            )
            .exec();
          break;
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  async checkViewExistence(view_ref_id) {
    try {
      const view = await this.viewModel
        .findOne({
          mb_id: this.mb_id,
          view_ref_id: view_ref_id,
        })
        .exec();
      return !!view;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = View;
