import { NavLink } from "react-router-dom";
import { useCart } from "../hooks/useCart";

const CartLink = () => {
  const { count } = useCart();

  if (count === 0) {
    return null;
  }

  return (
    <NavLink
      to="/cart"
      className="cart-link"
      aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
      title="View cart"
    >
      <svg
        className="cart-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
        <path d="M2 3h3l2.6 11.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L21 7H6" />
      </svg>

      <span className="cart-count" aria-hidden="true">
        {count}
      </span>
    </NavLink>
  );
};

export default CartLink;
