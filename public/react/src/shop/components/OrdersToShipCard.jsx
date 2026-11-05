import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrderCounts } from "../services/orders";

const OrdersToShipCard = ({ className = "dashboard-card" }) => {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getOrderCounts();
        if (res.data.success) {
          setCount(res.data.orders_to_ship);
        }
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  return (
    <Link to="/admin/orders" className={className}>
      <span className="dashboard-card-count">{count ?? "–"}</span>
      <span className="dashboard-card-label">Orders to Ship</span>
    </Link>
  );
};

export default OrdersToShipCard;
