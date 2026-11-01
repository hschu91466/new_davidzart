import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { startCheckout } from "../../services/orders";

const formatPrice = (cents) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(cents) / 100);

const Cart = () => {
  const { items, removeItem, updateQuantity, subtotalCents } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await startCheckout(
        items.map((item) => ({
          item_type: item.item_type,
          item_id: item.item_id,
          quantity: item.quantity,
        })),
      );

      if (res.data.success) {
        window.location.href = res.data.url;
        return;
      }

      setError(res.data.message || "Unable to start checkout.");
    } catch (err) {
      console.error(err);
      setError("Unable to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container cart-page">
        <h1>Your Cart</h1>
        <p role="status">Your cart is empty.</p>
        <Link to="/galleries" className="btn">
          Browse Galleries
        </Link>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h1>Your Cart</h1>

      <ul className="cart-list">
        {items.map((item) => (
          <li key={`${item.item_type}-${item.item_id}`} className="cart-item">
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.title}
                className="cart-item-image"
              />
            )}

            <div className="cart-item-details">
              <strong>{item.title}</strong>
              <span>{formatPrice(item.price_cents)}</span>

              {item.max_quantity > 1 && (
                <label className="cart-item-quantity">
                  Qty
                  <input
                    type="number"
                    min="1"
                    max={item.max_quantity}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(
                        item.item_type,
                        item.item_id,
                        Number(e.target.value),
                      )
                    }
                  />
                </label>
              )}
            </div>

            <button
              className="btn btn-delete btn-sm"
              onClick={() => removeItem(item.item_type, item.item_id)}
              disabled={loading}
              aria-label={`Remove ${item.title} from cart`}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="cart-summary">
        <p>
          Subtotal: <strong>{formatPrice(subtotalCents)}</strong>
        </p>
        <p className="cart-note">Shipping is calculated at checkout.</p>

        {error && (
          <p role="alert" className="buy-error">
            {error}
          </p>
        )}

        <button className="btn" onClick={handleCheckout} disabled={loading}>
          {loading ? "Loading..." : "Checkout"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
