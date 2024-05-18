import express, { NextFunction,Request,Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { IUser, UserModel } from "../models/user";
import { UserErrors } from "../routes/errors";


const router = express.Router();

router.post("/register", async (req, res) => {
    const { username, password } = req.body; // Get the username and password from the request body
    try {
        const user = await UserModel.findOne({ username }); // Check if the user already exists
        if (user) { // If the user exists, return an error
            return res.status(400).json({ type: UserErrors.USERNAME_ALREADY_EXISTS }); // Return a 400 status code and the error type
        }
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const newUser = new UserModel({ username, password: hashedPassword }); // Create a new user
        await newUser.save(); // Save the user to the database
        res.json({ message: "User registered successfully" });
    } catch (err) { // If an error occurs, return a 500 status code and the error
        res.status(500).json({ type: err });
    }

});

router.post("/login", async (req, res) => { // Create a new route to handle user login
    const { username, password } = req.body;
  
    try {
      // IUser is the interface we created in the user model
      const user: IUser = await UserModel.findOne({ username }); // Find the user by the username
  
      if (!user) {
        return res.status(400).json({ type: UserErrors.USER_NOT_FOUND });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ type: UserErrors.WRONG_CREDENTIALS });
      }

      // Create a token with the user ID and the secret key "secret" (this should be a long and complex string)
      const token = jwt.sign({ id: user._id }, "secret"); 
      res.json({ token, userID: user._id }); // Return the token and the user ID in the response body 
    } catch (err) {
      res.status(500).json({ type: err });
    }
  });


  // Create a middleware to verify the token
  export const verifyToken = (req:Request, res:Response, next: NextFunction) => { 
    const authHeader = req.headers.authorization; // Get the authorization header from the request headers 
    console.log(authHeader);
    if (authHeader) { // If the authorization header exists
      jwt.verify(authHeader, "secret", (err) => { // Verify the token with the secret
        if (err) {
          return res.sendStatus(403); // If the token is invalid, return a 403 status code and 403 means forbidden
        }
        next(); // If the token is valid, call the next function in the middleware chain 
      });
    } else {
      res.sendStatus(401); // If the authorization header doesn't exist, return a 401 status code and 401 means unauthorized
    }
  };

router.get("/available-money/:userID", verifyToken, async (req: Request, res: Response) => {
  const {userID} = req.params;

  try {
    
    const user = await UserModel.findById(userID); // Find the user by the userID
    if (!user) {
      return res.status(400).json({ type: UserErrors.USER_NOT_FOUND });
    }

    res.json({ availableMoney: user.availableMoney }); // Return the availableMoney of the user in the response body
  } catch (error) {
    res.status(500).json({ message: error.message });
  }


});

export {router as userRouter}; // Export the router
