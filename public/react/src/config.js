const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost/Sites/production/davidschu_new/public"
    : "";

export default BASE_URL;
