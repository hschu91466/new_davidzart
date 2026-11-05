import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";

const formatPrice = (cents) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(Number(cents) / 100);

const AddToCartButton = ({ item, itemType }) => {
  const { addItem, isInCart } = useCart();

  if (!item) {
    return null;
  }

  if (item.is_sold) {
    return (
      <span className="status-badge sold">
        {itemType === "product" ? "Sold Out" : "Sold"}
      </span>
    );
  }

  if (!item.can_buy) {
    return null;
  }

  const maxQuantity = item.max_quantity ?? 1;
  const inCart = isInCart(itemType, item.id);
  const oneOfAKind = maxQuantity === 1;

  const handleAdd = (e) => {
    e.stopPropagation();
    addItem({
      item_type: itemType,
      item_id: item.id,
      title: item.title || "Untitled",
      price_cents: item.price_cents,
      image_url: item.image_url,
      max_quantity: maxQuantity,
    });
  };

  return (
    <div className="buy-box">
      <span className="buy-price">{formatPrice(item.price_cents)}</span>

      {inCart && oneOfAKind ? (
        <Link to="/cart" className="btn" onClick={(e) => e.stopPropagation()}>
          In Cart — View Cart
        </Link>
      ) : (
        <button className="btn" onClick={handleAdd}>
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;
