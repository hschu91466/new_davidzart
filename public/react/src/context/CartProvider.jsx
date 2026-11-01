import { useEffect, useState } from "react";
import { CartContext } from "./cartContext";

const STORAGE_KEY = "cart";

const loadCart = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const sameItem = (a, type, id) => a.item_type === type && a.item_id === id;

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable (private mode, etc.) — cart still works for this visit
    }
  }, [items]);

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

  const clearCart = () => setItems([]);

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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
