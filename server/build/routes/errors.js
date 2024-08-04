"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductErrors = exports.UserErrors = void 0;
var UserErrors;
(function (UserErrors) {
    UserErrors["USERNAME_ALREADY_EXISTS"] = "username_already_exists";
    UserErrors["USER_NOT_FOUND"] = "user_not_found";
    UserErrors["WRONG_CREDENTIALS"] = "wrong_credentials";
})(UserErrors || (exports.UserErrors = UserErrors = {}));
var ProductErrors;
(function (ProductErrors) {
    ProductErrors["NO_PRODUCTS_FOUND"] = "no_products_found";
    ProductErrors["NO_USER_FOUND"] = "no_user_found";
    ProductErrors["NOT_ENOUGH_STOCK"] = "not_enough_stock";
    ProductErrors["NO_AVAILABLE_MONEY"] = "no_available_money";
})(ProductErrors || (exports.ProductErrors = ProductErrors = {}));
