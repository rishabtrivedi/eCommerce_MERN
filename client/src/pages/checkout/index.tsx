import { useGetProducts } from "../../hooks/useGetProducts";
import { IProduct } from "../../models/interfaces";
import { ShopContext } from "../../context/shop-context";
import React, { useContext } from "react";
import './style.css';
import { CartItem } from "./cart-item";
import { useNavigate } from "react-router-dom";


export const CheckoutPage = () => {
    const { getCartItemCount,getTotalCartAmount,checkout} =useContext(ShopContext);
    const { products } = useGetProducts();
    const navigate = useNavigate();
    const totalAmount = getTotalCartAmount();
    

    return (
        <div className="cart">
            <div>
                <h1>Your Cart Items</h1>
            </div>
            <div className="cart">
                {products.map((product: IProduct) => {
                    if (getCartItemCount(product._id) !== 0) {
                        return (<CartItem product = {product}/>);
                    }
                })}
            </div>

            {totalAmount>0 ?(
            <div className="checkout">
                <p> Subtotal: ${totalAmount.toFixed(2)}</p>
                <button onClick={() => navigate('/') }> Continue Shopping</button>
                <button onClick={checkout}> Checkout</button>

            </div>
            ) : (<h1> Your Shopping Cart is Empty</h1>)
            }
        </div>
    );
};