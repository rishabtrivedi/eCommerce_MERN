import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { IShopContext , ShopContext } from "../context/shop-context";

export const Navbar = () => {
  const {availableMoney} = useContext<IShopContext>(ShopContext);
    return(
        <div className="navbar">
      <div className="navbarTitle">
        <h1>Rishab Shop</h1>
        </div>

        <div className="navbarLinks">
            <Link to="/">Shop</Link>
            <Link to="/purchased-items">Purchases</Link>
            <Link to="/checkout"><FontAwesomeIcon icon={faShoppingCart} /> </Link>
            <Link to="/auth"> Logout </Link>
            <span> $ {availableMoney.toFixed(2)} </span>
            </div>

      </div>
    );

};