import { ReactNode, createContext, useEffect, useState } from "react";
import { useGetProducts } from "../hooks/useGetProducts";
import { IProduct } from "../models/interfaces";
import axios, { AxiosError, AxiosResponse } from "axios";
// import { ProductErrors } from "../models/errors";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useGetToken } from "../hooks/useGetToken";

export interface IShopContext {
  getCartItemCount: (itemId: string) => number;
  addToCart: (itemId: string) => void;
  updateCartItemCount: (newAmount: number, itemId: string) => void;
  removeFromCart: (itemId: string) => void;
  getTotalCartAmount: () => number;
  checkout: () => void;
  availableMoney: number;
}

const defaultVal: IShopContext = {
  addToCart: () => null,
  removeFromCart: () => null,
  updateCartItemCount: () => null,
  getCartItemCount: () => 0,
  getTotalCartAmount: () => 0,
  checkout: () => null,
  availableMoney: 0,
};

// Create a context with the default value of an empty object
export const ShopContext = createContext<IShopContext>(defaultVal); 

export const ShopContextProvider = (props) => {
  
  const [cartItems, setCartItems] = useState<{string:number} | {}>({}); // Create a state to store the cart items
  const [availableMoney, setAvailableMoney] = useState<number>(0);
  const [purchasedItems, setPurchasedItems] = useState<IProduct[]>([]); // [itemID: amount]

  const { products, fetchProducts } = useGetProducts();
  const { headers } = useGetToken();
  const navigate = useNavigate();
  
  const fetchAvailableMoney = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/auth/available-money/${localStorage.getItem("userID")}`,
        { headers }
      );
      setAvailableMoney(res.data.availableMoney);
    } catch (error) {
      alert("Error fetching available money");
    }
    
  };

  const fetchPurchasedItems = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/auth/available-money/${localStorage.getItem("userID")}`,
        { headers }
      );
      setPurchasedItems(res.data.purchasedItems);
    } catch (error) {
      alert("Error fetching available money");
    }
    
  };

  const addToCart = (itemId: string) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };

  const getCartItemCount = (itemId: string): number => {
    if (itemId in cartItems) {
      return cartItems[itemId];
    }

    return 0;
  };

  const removeFromCart = (itemId: string) => {
    if (!cartItems[itemId]) return;
    if (cartItems[itemId] === 0) return;
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  };

  const updateCartItemCount = (newAmount: number, itemId: string) => { // Add an item to the cart
    if (newAmount<0) return;
    setCartItems((prev) => ({ ...prev, [itemId]: newAmount }));
    
  };

  const getTotalCartAmount = (): number => {
    let totalAmount = 0;
    for (const item in cartItems){
      if (cartItems[item] > 0) {
        let itemInfo: IProduct = products.find(
          (product) => product._id === item
        );

        totalAmount += cartItems[item] * itemInfo.price;
      }
    }
    return totalAmount;
    
  };

  const checkout = async() => {
    const body = { customerID: localStorage.getItem("userID"), cartItems };
    try {
      await axios.post(
        "http://localhost:3001/products/checkout",
        body,
        { headers }
      );
      setCartItems({});
      fetchAvailableMoney();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // fetchProducts();
    fetchAvailableMoney();
  }, []);

  const contextValue: IShopContext = {
    addToCart,
    removeFromCart,
    updateCartItemCount,
    getCartItemCount,
    getTotalCartAmount,
    checkout,
    availableMoney,
  };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
}