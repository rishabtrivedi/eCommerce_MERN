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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = exports.verifyToken = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../models/user");
const errors_1 = require("../routes/errors");
const router = express_1.default.Router();
exports.userRouter = router;
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body; // Get the username and password from the request body
    try {
        const user = yield user_1.UserModel.findOne({ username }); // Check if the user already exists
        if (user) { // If the user exists, return an error
            return res.status(400).json({ type: errors_1.UserErrors.USERNAME_ALREADY_EXISTS }); // Return a 400 status code and the error type
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10); // Hash the password
        const newUser = new user_1.UserModel({ username, password: hashedPassword }); // Create a new user
        yield newUser.save(); // Save the user to the database
        res.json({ message: "User registered successfully" });
    }
    catch (err) { // If an error occurs, return a 500 status code and the error
        res.status(500).json({ type: err });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        // IUser is the interface we created in the user model
        const user = yield user_1.UserModel.findOne({ username }); // Find the user by the username
        if (!user) {
            return res.status(400).json({ type: errors_1.UserErrors.USER_NOT_FOUND });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ type: errors_1.UserErrors.WRONG_CREDENTIALS });
        }
        // Create a token with the user ID and the secret key "secret" (this should be a long and complex string)
        const token = jsonwebtoken_1.default.sign({ id: user._id }, "secret");
        res.json({ token, userID: user._id }); // Return the token and the user ID in the response body 
    }
    catch (err) {
        res.status(500).json({ type: err });
    }
}));
// Create a middleware to verify the token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization; // Get the authorization header from the request headers 
    console.log(authHeader);
    if (authHeader) { // If the authorization header exists
        jsonwebtoken_1.default.verify(authHeader, "secret", (err) => {
            if (err) {
                return res.sendStatus(403); // If the token is invalid, return a 403 status code and 403 means forbidden
            }
            next(); // If the token is valid, call the next function in the middleware chain 
        });
    }
    else {
        res.sendStatus(401); // If the authorization header doesn't exist, return a 401 status code and 401 means unauthorized
    }
};
exports.verifyToken = verifyToken;
router.get("/available-money/:userID", exports.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userID } = req.params;
    try {
        const user = yield user_1.UserModel.findById(userID); // Find the user by the userID
        if (!user) {
            return res.status(400).json({ type: errors_1.UserErrors.USER_NOT_FOUND });
        }
        res.json({ availableMoney: user.availableMoney }); // Return the availableMoney of the user in the response body
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
