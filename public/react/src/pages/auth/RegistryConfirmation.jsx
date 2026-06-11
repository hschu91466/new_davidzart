import { useLocation} from "react-router-dom";

const RegistryConf = () => {
  const location = useLocation();
  const message = location.state?.message || "Registration successful.";
  return (
    <div className="container">
      <h2>{message}</h2>
      <p>We will review your registry request.</p>
    </div>
  )
};

export default RegistryConf;
