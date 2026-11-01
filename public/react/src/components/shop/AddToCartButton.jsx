import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";

const formatPrice = (cents) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(Number(cents) / 100);

const AddToCartButton = ({ image }) => {
  const { addItem, isInCart } = useCart();

  if (image.is_sold) {
    return <span className="status-badge sold">Sold</span>;
  }

  if (!image.can_buy) {
    return null;
  }

  const inCart = isInCart("image", image.id);

  const handleAdd = (e) => {
    e.stopPropagation();
    addItem({
      item_type: "image",
      item_id: image.id,
      title: image.title || "Untitled",
      price_cents: image.price_cents,
      image_url: image.image_url,
      max_quantity: 1,
    });
  };

  return (
    <div className="buy-box">
      <span className="buy-price">{formatPrice(image.price_cents)}</span>

      {inCart ? (
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
