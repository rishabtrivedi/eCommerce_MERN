import axios from "axios";
import { useEffect, useState } from "react";
import { useGetToken } from "./useGetToken";
import { IProduct } from "../models/interfaces";


// This hook is used to get the products from the server
export const useGetProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]); // Create a state to store the products array from the server
  const {headers} = useGetToken(); // Get the token from the useGetToken hook

  const fetchProducts = async () => {
    const products = await axios.get("http://localhost:3001/products",{headers,});    
    setProducts(products.data.products);// products.data.products is the array of products from the server
  };
  // Fetch the products from the server when the component is mounted

  useEffect(() => {
    fetchProducts();
  }, []);

  // Return the products array and the fetchProducts function
  return { products, fetchProducts };
};

