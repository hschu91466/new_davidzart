import axios from "./axios";

export const getQuotes = async () => {
  const res = await axios.get("/api/quotes/list.php");
  return res.data.quotes;
};

export const getRandomQuote = async () => {
  const res = await axios.get("/api/quotes/random.php");
  return res.data.quote;
};

export const getQuotesAdmin = async () => {
  const res = await axios.get("/api/quotes/admin-list.php");
  return res.data.quotes;
};

export const createQuote = async (data) => {
  const res = await axios.post("/api/quotes/create.php", data);
  return res.data;
};

export const updateQuote = async (data) => {
  const res = await axios.post("/api/quotes/update.php", data);
  return res.data;
};

export const deleteQuote = async (quoteId) => {
  const res = await axios.post("/api/quotes/delete.php", { quote_id: quoteId });
  return res.data;
};
