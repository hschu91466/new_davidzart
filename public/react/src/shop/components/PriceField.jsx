const PriceField = ({ item, idKey, onChange, label = "Price (USD)" }) => {
  const id = item[idKey];
  const isSold = Number(item.is_sold) === 1;

  const value =
    item.price ??
    (item.price_cents ? String(Number(item.price_cents) / 100) : "");

  return (
    <div className="price-field">
      <label htmlFor={`price-${id}`}>
        {label}
        {isSold && <span className="status-badge sold">Sold</span>}
      </label>

      <span
        className={isSold ? "price-locked" : undefined}
        title={
          isSold ? "Price is locked because this item has sold" : undefined
        }
      >
        <input
          id={`price-${id}`}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(id, "price", e.target.value)}
          placeholder="Leave blank if not for sale"
          disabled={isSold}
          aria-label={isSold ? `${label} (locked, item has sold)` : undefined}
        />
      </span>
    </div>
  );
};

export default PriceField;
