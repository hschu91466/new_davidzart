import { useEffect, useState } from "react";
import { getOrderCounts } from "../services/orders";

export const useOrdersToShip = () => {
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

  return count;
};
