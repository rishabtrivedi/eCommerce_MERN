import axios from "axios";
import { useEffect, useState } from "react";
import { useGetToken } from "./useGetToken";
import { IProduct } from "../models/interfaces";


export const useGetProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]); // Create a state to store the products array from the server
  const {headers} = useGetToken(); // Get the token from the useGetToken hook

  const fetchProducts = async () => {
    const products = await axios.get("http://localhost:3001/products",{headers,});    
    setProducts(products.data.products);// products.data.products is the array of products from the server
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, fetchProducts };
};

