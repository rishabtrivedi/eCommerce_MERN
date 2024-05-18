import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { Product } from "./product";

import "./style.css";
import { useGetProducts } from "../../hooks/useGetProducts";


export const ShopPage = () => {
    const { products } = useGetProducts()
    return (
        <div className="shop">
          <div className="products">
            {products.map((product) => (
             <Product product = {product}/> // Pass the product object to the Product component
            ))}
          </div>
        </div>
      );
};