class Definer{

    // ** Umumiy Error **//
    static general_err1 = "att: Something went wrong!";
    static general_err2 = "att: There is no data that params!";
    static general_err3 = "att: File upload error!";
    // ** memberga aloqador errorlar ** //
    static auth_err1 = "at: MongoDB validation is failed";
    static auth_err2 = "at: JWT token creation error";
    static auth_err3 = "at: no memeber with that name.";
    static auth_err4 = "at: your password is not created";
    static auth_err5 = "at: You are not authonticated user";

    // ** product ga aloqador errorlar **//
    static product_err1 = "att: Product creation is failed!";

    // ** Order related errors  ** //
    static order_err1 = "att: Order creation is failed!"
    static order_err2 = "att: Order_Item creation is failed!"
    static order_err3 = "att: No order with that params exists!"

    static article_err1 = "att: author member for articles not provided!";
  static article_err2 = "att: no article found for that member!";
}

module.exports = Definer;