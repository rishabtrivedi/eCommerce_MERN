"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const express_1 = require("express");
const product_1 = require("../models/product");
const user_1 = require("../models/user");
const user_2 = require("./user");
const errors_1 = require("./errors");
const router = (0, express_1.Router)();
exports.productRouter = router;
// Create a new route to get all products from the database
router.get("/", user_2.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_1.ProductModel.find({}); // {} means find all products
        res.json({ products }); // Return the products array in the response body
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
router.post("/checkout", user_2.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerID, cartItems } = req.body; // Get the customerID and cartItems from the request body
    try {
        const user = yield user_1.UserModel.findById(customerID); // Find the user by the customerID
        const productIDs = Object.keys(cartItems); // Get the productIDs from the cartItems object
        // Find the products by the productIDs where the productIDs are in the productIDs array
        const products = yield product_1.ProductModel.find({ _id: { $in: productIDs } });
        if (!user) { // If the user is not found
            return res.status(400).json({ type: errors_1.ProductErrors.NO_USER_FOUND });
        }
        // If the length of the products array is not equal to the length of the productIDs array because some products may not be found
        if (products.length !== productIDs.length) {
            return res.status(400).json({ type: errors_1.ProductErrors.NO_PRODUCTS_FOUND });
        }
        let totalPrice = 0;
        for (const item in cartItems) {
            // Find the product by the productID in the products array where the productID is equal to the item
            const product = products.find((product) => String(product._id) === item);
            if (!product) {
                return res.status(400).json({ type: errors_1.ProductErrors.NO_PRODUCTS_FOUND });
            }
            // if the stockQuantity of the product is less than the cartItems[item]
            if (product.stockQuantity < cartItems[item]) {
                return res.status(400).json({ type: errors_1.ProductErrors.NOT_ENOUGH_STOCK });
            }
            totalPrice += product.price * cartItems[item]; // Calculate the total price
            if (user.availableMoney < totalPrice) { // If the user's availableMoney is less than the totalPrice
                return res.status(400).json({ type: errors_1.ProductErrors.NO_AVAILABLE_MONEY });
            }
            user.availableMoney -= totalPrice;
            user.purchasedItems.push(...productIDs); // Add all the productIDs to the purchasedItems array of the user 
            yield user.save();
            // Update the stockQuantity of the product by the cartItems[item] where the productID is equal to the item
            yield product_1.ProductModel.updateMany({ _id: { $in: productIDs } }, // Find the products by the productIDs  where the productIDs are in the productIDs array
            { $inc: { stockQuantity: -1 } } // Decrement the stockQuantity by 1 for each product in the products array 
            );
            res.json({ purchasedItems: user.purchasedItems }); // Return the purchasedItems array in the response body
        }
        ;
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
router.get("/purchased-items/:customerID", user_2.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerID } = req.params;
    try {
        const user = yield user_1.UserModel.findById(customerID); // Find the user by the userID
        if (!user) {
            res.status(400).json({ type: errors_1.UserErrors.USER_NOT_FOUND });
        }
        const products = yield product_1.ProductModel.find({ _id: { $in: user.purchasedItems } });
        // Find the products by the productIDs where the productIDs are in the purchasedItems array
        res.json({ purchasedItems: user.availableMoney });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
