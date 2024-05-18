import { Schema, model } from "mongoose";

// Define the user schema 
// interface creates a new name that can be used everywhere in the code.
export interface IUser {
  _id?: string; // ? means it's optional and can be undefined
  username: string;
  password: string;
  availableMoney: number; // number type means it can be a floating point number or an integer
  purchasedItems: string[];
}

// Create a new schema for the user
const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  availableMoney: { type: Number, default: 5000 }, // Default value of 5000
  purchasedItems: [
    { type: Schema.Types.ObjectId, ref: "product", default: [] },
  ], // type is an array of ObjectIds, ref is the model it refers to, default is an empty array
});


export const UserModel = model<IUser>("user", UserSchema); // Create a new model for the user