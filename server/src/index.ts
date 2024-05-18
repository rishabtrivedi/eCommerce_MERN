import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/user";
import { productRouter } from "./routes/product";

const app = express(); // Create an express application

// This is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json()); 

// CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

app.use(cors()); 

// import the userRouter and productRouter and use them in the app
app.use("/user", userRouter);

// app.use("/auth", userRouter);
app.use("/products", productRouter);


mongoose.connect("mongodb+srv://rishabtrivedi0009:T6mxhm5IoVDS3Vn0@ecommerce.cyhgvgs.mongodb.net/ecommerce");


app.listen(3001, () => console.log("Server started"));