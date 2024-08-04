"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("./routes/user");
const product_1 = require("./routes/product");
const app = (0, express_1.default)(); // Create an express application
// This is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express_1.default.json());
// CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
app.use((0, cors_1.default)());
// import the userRouter and productRouter and use them in the app
app.use("/user", user_1.userRouter);
// app.use("/auth", userRouter);
app.use("/products", product_1.productRouter);
mongoose_1.default.connect("mongodb+srv://rishabtrivedi0009:T6mxhm5IoVDS3Vn0@ecommerce.cyhgvgs.mongodb.net/ecommerce");
app.listen(3001, () => console.log("Server started"));
