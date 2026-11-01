import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";

const OrderSuccess = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="container order-success">
      <h1>Thank You</h1>

      <p>Your purchase is complete. A receipt has been sent to your email.</p>

      <p>
        I'll be in touch shortly with shipping details. If you have any
        questions, please use the contact page.
      </p>

      <Link to="/galleries" className="btn">
        Back to Galleries
      </Link>
    </div>
  );
};

export default OrderSuccess;
