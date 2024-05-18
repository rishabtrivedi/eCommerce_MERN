import { ShopContext } from "../../context/shop-context";
import { IProduct } from "../../models/interfaces";
import React, { useContext } from "react";

// interface Props is a TypeScript feature that allows you to define the shape of an object.
interface Props {
    product: IProduct;
  }
  
// The Product component is a functional component that takes in a product object as a prop and returns a div with the product details.
export const Product = (props: Props) => {
    const { _id, productName, description, price, stockQuantity, imageURL } =
    props.product;

    const { addToCart, getCartItemCount} = useContext(ShopContext);
 
    const count = getCartItemCount(_id);
    console.log(count);
    return (
    <div className="product">
        <img src={imageURL} /> {" "}
        <div className="description">
        <h3>{productName}</h3>
        <p>{description}</p>
        <p> ${price}</p>
      </div>
        <button className="add-to-cart-bttn" onClick={() => addToCart(_id)}>
          Add to Cart {count > 0 && <> ({count}) </>}
          </button>
        <div className="stock-quantity">
        {/* // If the stockQuantity is 0, display "OUT OF STOCK" */}
        {stockQuantity === 0 && <h1> OUT OF STOCK</h1>} 
        </div>
        </div> 
    );
}; 