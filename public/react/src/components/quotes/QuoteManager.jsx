import { useState, useEffect } from "react";
import {
  getQuotesAdmin,
  createQuote,
  updateQuote,
  deleteQuote,
} from "../../services/quotes";

const emptyForm = { text: "", author: "", sort_order: 0, is_active: 1 };

const QuoteManager = () => {
  const [quotes, setQuotes] = useState([]);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const data = await getQuotesAdmin();
      setQuotes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (quote) => {
    setForm({
      text: quote.text,
      author: quote.author || "",
      sort_order: quote.sort_order,
      is_active: quote.is_active,
    });
    setEditingId(quote.quote_id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.text.trim()) return;

    try {
      setSavingId(editingId || "new");

      if (editingId) {
        await updateQuote({ quote_id: editingId, ...form });
      } else {
        await createQuote(form);
      }

      resetForm();
      await refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (quoteId) => {
    if (!window.confirm("Delete this quote?")) return;

    try {
      setSavingId(quoteId);
      await deleteQuote(quoteId);
      await refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleActive = async (quote) => {
    try {
      setSavingId(quote.quote_id);
      await updateQuote({ ...quote, is_active: quote.is_active ? 0 : 1 });
      await refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setSavingId(null);
    }
  };

  const filteredQuotes = quotes.filter((q) => {
    if (filter === "active") return Number(q.is_active) === 1;
    if (filter === "inactive") return Number(q.is_active) === 0;
    return true;
  });

  if (loading) return <p role="status">Loading quotes...</p>;

  return (
    <div className="quotes-page">
      <h1>Quotes</h1>

      <form onSubmit={handleSubmit} className="quote-form">
        <textarea
          placeholder="Quote text"
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Author (optional)"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />
        <input
          type="number"
          placeholder="Sort order"
          value={form.sort_order}
          onChange={(e) =>
            setForm({ ...form, sort_order: Number(e.target.value) })
          }
        />

        <div className="button-group">
          <button
            type="submit"
            className="btn btn-approve btn-sm"
            disabled={savingId !== null}
          >
            {editingId ? "Save changes" : "Add quote"}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn btn-sm"
              onClick={resetForm}
              disabled={savingId !== null}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div
        className="button-group filter-tabs"
        role="tablist"
        aria-label="Filter quotes by status"
      >
        <button
          className={`btn btn-tab ${filter === "all" ? "btn-active" : ""}`}
          onClick={() => setFilter("all")}
          role="tab"
          aria-selected={filter === "all"}
          aria-controls="quotes-table"
        >
          All ({quotes.length})
        </button>

        <button
          className={`btn btn-tab ${filter === "active" ? "btn-active" : ""}`}
          onClick={() => setFilter("active")}
          role="tab"
          aria-selected={filter === "active"}
          aria-controls="quotes-table"
        >
          Active ({quotes.filter((q) => Number(q.is_active) === 1).length})
        </button>

        <button
          className={`btn btn-tab ${filter === "inactive" ? "btn-active" : ""}`}
          onClick={() => setFilter("inactive")}
          role="tab"
          aria-selected={filter === "inactive"}
          aria-controls="quotes-table"
        >
          Inactive ({quotes.filter((q) => Number(q.is_active) === 0).length})
        </button>
      </div>

      {!filteredQuotes || filteredQuotes.length === 0 ? (
        <p role="status">No quotes found.</p>
      ) : (
        <div className="table-wrapper">
          <table
            id="quotes-table"
            className="table"
            aria-label="Quotes"
            role="table"
          >
            <thead>
              <tr role="row">
                <th scope="col">Status</th>
                <th scope="col">Quote</th>
                <th scope="col">Author</th>
                <th scope="col">Sort Order</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredQuotes.map((quote) => {
                const isActive = Number(quote.is_active) === 1;

                return (
                  <tr
                    key={quote.quote_id}
                    role="row"
                    className={!isActive ? "row-unread" : ""}
                  >
                    <td role="cell" data-label="Status">
                      <span
                        className={`status-badge ${
                          isActive ? "approved" : "pending"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td role="cell" data-label="Quote" className="message-cell">
                      "{quote.text}"
                    </td>

                    <td role="cell" data-label="Author">
                      {quote.author || "—"}
                    </td>

                    <td role="cell" data-label="Sort Order">
                      {quote.sort_order}
                    </td>

                    <td
                      role="cell"
                      data-label="Actions"
                      className="button-group"
                    >
                      <button
                        className="btn btn-sm"
                        onClick={() => handleToggleActive(quote)}
                        disabled={savingId === quote.quote_id}
                        aria-label={`${isActive ? "Deactivate" : "Activate"} quote`}
                      >
                        {isActive ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        className="btn btn-sm"
                        onClick={() => handleEdit(quote)}
                        disabled={savingId === quote.quote_id}
                        aria-label="Edit quote"
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-delete btn-sm"
                        onClick={() => handleDelete(quote.quote_id)}
                        disabled={savingId === quote.quote_id}
                        aria-label="Delete quote"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuoteManager;
