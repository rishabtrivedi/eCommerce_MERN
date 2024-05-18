import { Router, Request, Response } from "express";
import { ProductModel } from "../models/product";
import { UserModel } from "../models/user";
import { verifyToken } from "./user";
import { ProductErrors, UserErrors } from "./errors";

const router = Router();

// Create a new route to get all products from the database
  router.get("/",verifyToken, async (req: Request , res: Response) => {
    try {
        const products = await ProductModel.find({}); // {} means find all products
        res.json({ products }); // Return the products array in the response body

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
  }); 

  router.post("/checkout", verifyToken, async (req: Request, res: Response) => {
  const { customerID, cartItems } = req.body; // Get the customerID and cartItems from the request body
  try {
      
      const user = await UserModel.findById(customerID); // Find the user by the customerID
      const productIDs = Object.keys(cartItems); // Get the productIDs from the cartItems object
      
      // Find the products by the productIDs where the productIDs are in the productIDs array
      const products = await ProductModel.find({ _id: { $in: productIDs } }); 

      if (!user) { // If the user is not found
          return res.status(400).json({ type: ProductErrors.NO_USER_FOUND });
        }

      // If the length of the products array is not equal to the length of the productIDs array because some products may not be found
      if (products.length !== productIDs.length) {            
        return res.status(400).json({type: ProductErrors.NO_PRODUCTS_FOUND });
      }

      let totalPrice = 0;
      for (const item in cartItems) {
      
            // Find the product by the productID in the products array where the productID is equal to the item
            const product = products.find((product) => String(product._id) === item); 
            if (!product) {
                return res.status(400).json({ type: ProductErrors.NO_PRODUCTS_FOUND });
              }
              // if the stockQuantity of the product is less than the cartItems[item]
              if (product.stockQuantity < cartItems[item]) {
                return res.status(400).json({ type: ProductErrors.NOT_ENOUGH_STOCK });
              }
              totalPrice += product.price * cartItems[item]; // Calculate the total price

        if (user.availableMoney < totalPrice) { // If the user's availableMoney is less than the totalPrice
            return res.status(400).json({ type: ProductErrors.NO_AVAILABLE_MONEY });
          }
        user.availableMoney -= totalPrice;
        user.purchasedItems.push(...productIDs); // Add all the productIDs to the purchasedItems array of the user 
        await user.save();
          // Update the stockQuantity of the product by the cartItems[item] where the productID is equal to the item
        await ProductModel.updateMany(
            { _id: { $in: productIDs } }, // Find the products by the productIDs  where the productIDs are in the productIDs array
            { $inc: { stockQuantity: -1 } } // Decrement the stockQuantity by 1 for each product in the products array 
          );
          res.json({ purchasedItems: user.purchasedItems }); // Return the purchasedItems array in the response body
    };
  } catch (error) {
      res.status(400).json({ message: error.message });
  }

  });

router.get("/purchased-items/:customerID", verifyToken, async (req: Request, res: Response) => {
  const {customerID} = req.params;

  try {
    const user = await UserModel.findById(customerID); // Find the user by the userID
    if (!user) {
      res.status(400).json({ type: UserErrors.USER_NOT_FOUND });
    }

    const products = await ProductModel.find({_id: { $in: user.purchasedItems }}); 
    // Find the products by the productIDs where the productIDs are in the purchasedItems array

    res.json({ purchasedItems: user.availableMoney }); 
  } 
  catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export { router as productRouter };






