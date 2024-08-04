"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
// Create a new schema for the user
const UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    availableMoney: { type: Number, default: 5000 }, // Default value of 5000
    purchasedItems: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "product", default: [] },
    ], // type is an array of ObjectIds, ref is the model it refers to, default is an empty array
});
exports.UserModel = (0, mongoose_1.model)("user", UserSchema); // Create a new model for the user
