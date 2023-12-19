const { default: mongoose } = require("mongoose");

exports.member_type_enums = ["USER", "ADMIN", "PEDAL", "RESTAURANT"];
exports.member_status_enums = ["ONPAUSE", "ACTIVE",  "DELETED"];
exports.ordernary_enums = ["Y", "N"];
exports.product_collection_enums = ['dish','salad','dessert','drinks','etc'];
exports.product_status_enums =["PAUSED",'PROCESS','DELETED'];
exports.product_size_enums =['small','normal','large','set'];
exports.product_volume_enums = [0.5, 1, 1.2, 1.5, 2];

exports.like_view_group_list = ['product', 'member', 'community'] 
exports.board_id_enum_list = ['celebrity', 'evaluation', 'story']
exports.board_article_status_enum_list = ['active', 'deleted']
exports.order_status_enums = ['PAUSED', 'PROCESS', 'FINISHED', "DELETED"]

// ========================================//
// *      MONGODB RELATED COMMANDS        *//
// ========================================//

exports.shapeIntoMongooseObjectId = (target) =>{
    if(typeof target === 'string'){
        return new mongoose.Types.ObjectId(target);
    }else return target;
}

exports.lookup_auth_memebr_following = (mb_id, origin) => {
    const follow_id = origin === 'follows' ? '$subscriber_id' : '$_id'
    return {
        $lookup: {
            from: 'follows',
            let: {
                lc_follow_id: follow_id,
                lc_subscriber_id: mb_id,
                new_my_follow: true
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and:[
                                {$eq: ['$follow_id', '$$lc_follow_id']},
                                {$eq: ['$subscriber_id', '$$lc_subscriber_id']}
                            ]
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        subscriber_id: 1,
                        follow_id: 1,
                        my_following: '$$new_my_follow'
                    }
                }
            ],
            as: 'me_followed'
    }
}
}



