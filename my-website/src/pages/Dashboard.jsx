import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

//this function is for trending books, this is a new feature 
const trendingBooks = [
  {
    id: 1,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    cover: "/covers/book1.jpg",
  },
  {
    id: 2,
    title: "The Alchemist",
    author: "Paulo Coelho",
    cover: "/covers/book2.webp",
  },
  {
    id: 3,
    title: "Blockchain Principles",
    author: "Rhino Motuba",
    cover: "/covers/blockchain.png",
  },
  {
    id: 4,
    title: "Currency Trading Industry",
    author: "Rhino Motuba",
    cover: "/covers/Currency Trading Industry.png",
  },
];


function Dashboard({
  books,
  currentUser,
  onStockChange,
})
{
  const navigate = useNavigate();

  const[activeTrendingBook, setActiveTrendingBook] = useState(0);
  useEffect(() =>
  {
    const slideshowTimer = setInterval(() =>
    {
      setActiveTrendingBook((currentBook) =>
      {
        return (
          (currentBook + 1) % trendingBooks.length
        );
      });
    }, 4500);

    return ()    =>
    {
      clearInterval(slideshowTimer);
    };
  }, []);

  const [selectedBookId, setSelectedBookId] =
    useState(
      books.length > 0
        ? books[0].id
        : ""
    );

  const [borrowQuantity, setBorrowQuantity] =
    useState(1);

  const [borrowNote, setBorrowNote] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const totalTitles = books.length;

  const totalCopies = books.reduce(
    (total, book) =>
      total + book.quantity,
    0
  );

  const lowStockBooks = books.filter(
    (book) => book.quantity < 2
  );
  function showPreviousTrendingBook()
  {
    setActiveTrendingBook((currentBook) =>
    {
      if(currentBook === 0)
      {
        return trendingBooks.length - 1;
      }
      return currentBook - 1;
    });
  }

  function showNextTrendingBook()
  {
    setActiveTrendingBook((currentBook) =>
    {
      return(
        (currentBook + 1) % trendingBooks.length
      );
    });
  }

  function handleTrendingBookClick()
  {
    if(!currentUser)
    {
      navigate("/login");
      return;
    }
    

    const borrowSection = document.getElementById("borrow-book");
    if(borrowSection)
    {
      borrowSection.scrollIntoView({behavior: "smooth", block: "start",});
      
    }
  }
  function handleBorrow(event)
  {
    event.preventDefault();

    setMessage("");
    setError("");
    if(!currentUser)
    {
      //here i make sure only members can borrow, which was not in these my previous designs
      setError(
        "You must be logged in to borrow books"
      )
      return;
    }

    if (!selectedBookId)
    {
      setError(
        "Please select a book"
      );
      return;
    }
    const borrowerDetails = 
      `${currentUser.name}` + 
      `(${currentUser.membershipId})`;

    const result = onStockChange(
      Number(selectedBookId),
      "borrow",
      Number(borrowQuantity),
      borrowNote,
      borrowerDetails
    );

    if (!result.success)
    {
      setError(result.message);
      return;
    }

    setMessage(
      "Book borrowed successfully"
    );

    setBorrowQuantity(1);
    setBorrowNote("");
    updateTransactionList({
      bookId: Number(selectedBookId),
      type: "borrow",
      quantity: Number(borrowQuantity),
      note: borrowNote,
      date: new Date().toISOString(),
    });
    
  }
  

  return (
    
    <section className="page-card dashboard-card">
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            Library overview
          </p>

          <h1>Dashboard</h1>

          <p className="page-description">
            Check book availability and borrow
            books from the community library
          </p>
        </div>

        <div className="heading-badge">
          {currentUser
            ? currentUser.role
            : "Guest"}
        </div>
      </div>
      <section className="trending-section">
        <div className="trending-heading">
          <div>
            <p className="eyebrow">
              Reader favourites
            </p>

            <h2>
              Most Trending Books
            </h2>

            <p>
              Click a cover to borrow it
            </p>
          </div>

          <div className="trending-controls">
            <button
              type="button"
              className="carousel-button"
              onClick={showPreviousTrendingBook}
              aria-label="Show previous trending book"
            >
              ←
            </button>

            <button
              type="button"
              className="carousel-button"
              onClick={showNextTrendingBook}
              aria-label="Show next trending book"
            >
              →
            </button>
          </div>
        </div>

        <button
          type="button"
          className="trending-cover-button"
          onClick={handleTrendingBookClick}
        >
          <img
            src={
              trendingBooks[
                activeTrendingBook
              ].cover
            }
            alt={
              trendingBooks[
                activeTrendingBook
              ].title
            }
          />

          <div className="trending-book-details">
            <span className="trending-label">
              Trending now
            </span>

            <h3>
              {
                trendingBooks[
                  activeTrendingBook
                ].title
              }
            </h3>

            <p>
              {
                trendingBooks[
                  activeTrendingBook
                ].author
              }
            </p>

            <span className="trending-action">
              {currentUser
                ? "Fill form to borrow"
                : "Click to sign in"}
            </span>
          </div>
        </button>

        <div className="trending-dots">
          {trendingBooks.map((book, index) =>
          {
            return (
              <button
                type="button"
                key={book.id}
                className={
                  index === activeTrendingBook
                    ? "trending-dot active"
                    : "trending-dot"
                }
                onClick={() =>
                {
                  setActiveTrendingBook(index);
                }}
                aria-label={
                  `Show ${book.title}`
                }
              />
            );
          })}
        </div>
      </section>


      <div className="dashboard-stat-grid">
        <div className="dashboard-stat">
          <span>Total titles</span>
          <strong>{totalTitles}</strong>
          <small>registered books</small>
        </div>

        <div className="dashboard-stat">
          <span>Copies available</span>
          <strong>{totalCopies}</strong>
          <small>across all titles</small>
        </div>

        <div className="dashboard-stat dashboard-stat-warning">
          <span>Low-stock titles</span>
          <strong>
            {lowStockBooks.length}
          </strong>
          <small>fewer than two copies</small>
        </div>
      </div>

      <div className="dashboard-content-grid">
        <div className="availability-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">
                Shelf availability
              </p>

              <h2>Available Books</h2>
            </div>
          </div>

          {books.length === 0 ? (
            <p>No books are currently registered</p>
          ) : (
            <div className="availability-list">
              {books.map((book) =>
              {
                const isLowStock =
                  book.quantity < 2;

                return (
                  <div
                    className="availability-card"
                    key={book.id}
                  >
                    <div className="book-symbol">
                      BK
                    </div>

                    <div className="book-information">
                      <h3>{book.title}</h3>

                      <p>
                        {book.author}
                      </p>

                      <small>
                        {book.genre}
                      </small>
                    </div>

                    <div
                      className={
                        isLowStock
                          ? "stock-count low-stock"
                          : "stock-count"
                      }
                    >
                      <strong>
                        {book.quantity}
                      </strong>

                      <span>
                        {book.quantity === 1
                          ? "copy"
                          : "copies"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div id = "borrow-book" className="borrow-panel">
          <p className="eyebrow">
            Book borrowing
          </p>

          <h2>Borrow a Book</h2>

          <p>
            Guests and registered users can
            record a borrowing request here
          </p>

          <form onSubmit={handleBorrow}>
            <label htmlFor="borrowBook">
              Select book
            </label>

            <select
              id="borrowBook"
              value={selectedBookId}
              onChange={(event) =>
                setSelectedBookId(
                  event.target.value
                )
              }
            >
              {books.map((book) =>
              {
                return (
                  <option
                    key={book.id}
                    value={book.id}
                    disabled={
                      book.quantity === 0
                    }
                  >
                    {book.title}{" "}
                    {book.quantity === 0
                      ? "(out of stock)"
                      : `(${book.quantity} available)`}
                  </option>
                );
              })}
            </select>

            <label htmlFor="borrowQuantity">
              Quantity
            </label>

            <input
              id="borrowQuantity"
              type="number"
              min="1"
              step="1"
              value={borrowQuantity}
              onChange={(event) =>
                setBorrowQuantity(
                  event.target.value
                )
              }
            />

            <label htmlFor="borrowNote">
              Borrower note
            </label>

            <input
              id="borrowNote"
              type="text"
              value={borrowNote}
              onChange={(event) =>
                setBorrowNote(
                  event.target.value
                )
              }
              placeholder="Optional membership ID"
            />

            <button
              type="submit"
              disabled={books.length === 0}
            >
              Borrow Book
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
        </div>
      </div>

      {lowStockBooks.length > 0 && (
        <div className="permission-notice">
          <strong>
            Low-stock reminder
          </strong>

          <p>
            {lowStockBooks.length} title
            {lowStockBooks.length === 1
              ? " has"
              : "s have"} fewer than two
            copies available
          </p>
        </div>
      )}
    </section>
  );
}

export default Dashboard;
