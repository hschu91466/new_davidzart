import { useEffect, useState } from "react";
import { CartContext } from "./cartContext";
import "../styles/shop.css";

const STORAGE_KEY = "cart";
const CHECKOUT_KEY = "cart_checkout";

const loadCart = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const loadCheckout = () => {
  try {
    const saved = localStorage.getItem(CHECKOUT_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const sameItem = (a, type, id) => a.item_type === type && a.item_id === id;

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadCart);
  const [pendingCheckout, setPendingCheckoutState] = useState(loadCheckout);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable (private mode, etc.) — cart still works for this visit
    }
  }, [items]);

  // Saved immediately (not in an effect), because checkout leaves the
  // page for Stripe right after this is called.
  const setPendingCheckout = (value) => {
    setPendingCheckoutState(value);

    try {
      if (value) {
        localStorage.setItem(CHECKOUT_KEY, JSON.stringify(value));
      } else {
        localStorage.removeItem(CHECKOUT_KEY);
      }
    } catch {
      // Storage unavailable — release just won't happen
    }
  };

  const addItem = (item, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((i) =>
        sameItem(i, item.item_type, item.item_id),
      );

      if (existing) {
        return current.map((i) =>
          sameItem(i, item.item_type, item.item_id)
            ? {
                ...i,
                quantity: Math.min(i.quantity + quantity, i.max_quantity),
              }
            : i,
        );
      }

      return [
        ...current,
        { ...item, quantity: Math.min(quantity, item.max_quantity) },
      ];
    });
  };

  const updateQuantity = (type, id, quantity) => {
    setItems((current) =>
      current
        .map((i) =>
          sameItem(i, type, id)
            ? {
                ...i,
                quantity: Math.min(Math.max(quantity, 0), i.max_quantity),
              }
            : i,
        )
        .filter((i) => i.quantity > 0),
    );
  };

  const removeItem = (type, id) => {
    setItems((current) => current.filter((i) => !sameItem(i, type, id)));
  };

  const clearCart = () => {
    setItems([]);
    setPendingCheckout(null);
  };

  const isInCart = (type, id) => items.some((i) => sameItem(i, type, id));

  const count = items.reduce((total, i) => total + i.quantity, 0);

  const subtotalCents = items.reduce(
    (total, i) => total + i.price_cents * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        isInCart,
        count,
        subtotalCents,
        pendingCheckout,
        setPendingCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
