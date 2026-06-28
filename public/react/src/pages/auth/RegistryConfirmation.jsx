import { useLocation } from "react-router-dom";

const RegistryConf = () => {
  const location = useLocation();
  const message = location.state?.message || "Registration successful.";

  return (
    <div className="container">
      <h1 role="status" aria-live="polite">
        {message}
      </h1>
      <p>We will review your registration request.</p>
    </div>
  );
};

export default RegistryConf;
