import { useContext } from "react";
import { CartContext } from "../context/cartContext";

export const useCart = () => useContext(CartContext);
