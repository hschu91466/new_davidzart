import axios from "./axios";

export const getDashboardCounts = () => {
  return axios.get("/api/admin/dashboard-counts.php");
};
