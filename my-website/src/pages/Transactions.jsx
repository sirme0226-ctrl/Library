import { useState } from "react";

function Transactions({
  books,
  onStockChange,
  transactions,
})
{
  const [formData, setFormData] = useState({
    bookId:
      books.length > 0
        ? books[0].id
        : "",
    type: "arrival",
    quantity: "",
    by: "",
    note: "",
  });

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  function handleChange(event)
  {
    const {
      name,
      value,
    } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSubmit(event)
  {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!formData.bookId)
    {
      setError(
        "Please select a book"
      );

      return;
    }

    if (
      formData.quantity === "" ||
      Number(formData.quantity) <= 0 ||
      !Number.isInteger(
        Number(formData.quantity)
      )
    )
    {
      setError(
        "Quantity must be a whole number greater than zero"
      );

      return;
    }

    if (formData.by.trim() === "")
    {
      setError(
        "Please enter the name or ID of the person making the transaction"
      );

      return;
    }

    const result = onStockChange(
      Number(formData.bookId),
      formData.type,
      Number(formData.quantity),
      formData.note,
      formData.by
    );

    if (!result.success)
    {
      setError(result.message);

      return;
    }

    setMessage(result.message);

    setFormData({
      bookId:
        books.length > 0
          ? books[0].id
          : "",
      type: "arrival",
      quantity: "",
      by: "",
      note: "",
    });
  }

  function formatDate(date)
  {
    return new Date(date).toLocaleString();
  }

  return (
    <section className="page-card">
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            Stock activity
          </p>

          <h1>Transactions</h1>

          <p className="page-description">
            Add new stock or record books
            borrowed by library users
          </p>
        </div>

        <div className="heading-badge">
          {transactions.length} records
        </div>
      </div>

      <div className="form-panel">
        <p className="eyebrow">
          Stock control
        </p>

        <h2>
          Record Stock Transaction
        </h2>

        {books.length === 0 ? (
          <p>
            Please add a book before creating
            a transaction
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="bookId">
              Book
            </label>

            <select
              id="bookId"
              name="bookId"
              value={formData.bookId}
              onChange={handleChange}
            >
              {books.map((book) =>
              {
                return (
                  <option
                    key={book.id}
                    value={book.id}
                  >
                    {book.title}{" "}
                    - {book.quantity} available
                  </option>
                );
              })}
            </select>

            <label htmlFor="type">
              Transaction Type
            </label>

            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="arrival">
                Add Stock
              </option>

              <option value="borrow">
                Borrow Book
              </option>
            </select>

            <label htmlFor="quantity">
              Quantity
            </label>

            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              step="1"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
            />

            <label htmlFor="by">
              By
            </label>

            <input
              id="by"
              name="by"
              type="text"
              value={formData.by}
              onChange={handleChange}
              placeholder="Name or membership ID"
            />

            <label htmlFor="note">
              Note
            </label>

            <input
              id="note"
              name="note"
              type="text"
              value={formData.note}
              onChange={handleChange}
              placeholder="Optional note"
            />

            <button type="submit">
              Save Transaction
            </button>

            {message && (
              <p className="success-message">
                {message}
              </p>
            )}

            {error && (
              <p className="error-message">
                {error}
              </p>
            )}
          </form>
        )}
      </div>

      <hr />

      <div className="panel-heading">
        <div>
          <p className="eyebrow">
            Activity log
          </p>

          <h2>
            Transaction History
          </h2>
        </div>
      </div>

      {transactions.length === 0 ? (
        <p>
          No transactions recorded yet
        </p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Book</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>By</th>
                <th>Note</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) =>
              {
                return (
                  <tr key={transaction.id}>
                    <td>
                      {formatDate(
                        transaction.date
                      )}
                    </td>

                    <td>
                      {transaction.bookTitle}
                    </td>

                    <td>
                      {transaction.type ===
                      "arrival"
                        ? "Stock added"
                        : "Book borrowed"}
                    </td>

                    <td>
                      {transaction.quantity}
                    </td>

                    <td>
                      {transaction.by ||
                        "Not specified"}
                    </td>

                    <td>
                      {transaction.note ||
                        "No note"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Transactions;
