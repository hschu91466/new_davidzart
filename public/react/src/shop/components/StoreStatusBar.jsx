import { useEffect, useState } from "react";
import { getShopSettings, updateShopSettings } from "../services/orders";

const StoreStatusBar = () => {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getShopSettings();
        if (res.data.success) {
          setSettings(res.data);
        } else {
          setError(res.data.message || "Unable to load store settings.");
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load store settings.");
      }
    };

    load();
  }, []);

  const handleToggle = async () => {
    const opening = !settings.store_open;

    const message = opening
      ? settings.mode === "live"
        ? "Open the store? Visitors will be able to buy with real payments."
        : "Open the store? Payments are in TEST mode, so real cards will not work."
      : "Close the store? Prices and Add to Cart buttons will be hidden.";

    if (!window.confirm(message)) return;

    try {
      setSaving(true);
      setError("");
      const res = await updateShopSettings(opening);
      if (res.data.success) {
        setSettings(res.data);
      } else {
        setError(res.data.message || "Unable to update the store.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to update the store.");
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return error ? <p role="alert">{error}</p> : null;
  }

return (
  <section className="store-settings" aria-labelledby="store-settings-title">
    <h2 id="store-settings-title">Store Settings</h2>

    <div className="store-settings-row">
      <span className="store-settings-label">Store</span>
      <span
        className={`status-badge ${settings.store_open ? "store-open" : "store-closed"}`}
      >
        {settings.store_open ? "Open" : "Closed"}
      </span>
    </div>

    <div className="store-settings-row">
      <span className="store-settings-label">Payments</span>
      <span className={`status-badge mode-${settings.mode.replace(" ", "-")}`}>
        {settings.mode === "live"
          ? "Live"
          : settings.mode === "test"
            ? "Test"
            : "Not set"}
      </span>
    </div>

    {settings.allowed && (
      <button
        className={`btn btn-sm store-settings-button ${settings.store_open ? "btn-delete" : "btn-approve"}`}
        onClick={handleToggle}
        disabled={saving}
        aria-busy={saving}
      >
        {saving
          ? "Saving..."
          : settings.store_open
            ? "Close Store"
            : "Open Store"}
      </button>
    )}

    <p className="store-settings-note">
      {!settings.allowed
        ? "The shop is turned off in the server settings."
        : settings.store_open
          ? "The store is open. Visitors can see prices and buy."
          : "While the store is closed, visitors can't see prices or buy."}
    </p>

    {error && (
      <p role="alert" className="buy-error">
        {error}
      </p>
    )}
  </section>
);
};

export default StoreStatusBar;
