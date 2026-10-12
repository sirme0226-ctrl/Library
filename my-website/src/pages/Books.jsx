import { useState } from "react";

const emptyForm = {
  title: "",
  author: "",
  genre: "",
  isbn: "",
  quantity: "",
};

function Books({ books, setBooks }) {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);


  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function validateForm() {
    const newErrors = {};

    if (formData.title.trim() === "") {
      newErrors.title = "Title is required.";
    }

    if (formData.author.trim() === "") {
      newErrors.author = "Author is required.";
    }

    if (formData.genre.trim() === "") {
      newErrors.genre = "Genre is required.";
    }

    const cleanedIsbn = formData.isbn.replace(/[-\s]/g, "");

    if (!/^\d{10}(\d{3})?$/.test(cleanedIsbn)) {
      newErrors.isbn = "ISBN must contain 10 or 13 digits.";
    }

    if (
      formData.quantity === "" ||
      Number(formData.quantity) < 0 ||
      !Number.isInteger(Number(formData.quantity))
    ) {
      newErrors.quantity =
        "Quantity must be a whole number of zero or more.";
    }

    return newErrors;
  }
  function handleEdit(book)
  {
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      isbn: book.isbn,
      quantity: book.quantity,
    });
    setErrors({});
    setMessage("");
  }

  function handleDelete(bookId)
  {
    const confirmed = window.confirm("Are you sure you want to delete this book?");
    if(!confirmed)
    {
        return;
    }
    const remainingBooks = books.filter(
        (book) => book.id !== bookId
    );
    setBooks(remainingBooks);
    setMessage("Book deleted successfully");
    setTimeout(() => {
        setMessage("");
    }, 3000);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      setMessage("");
      return;
    }

    const newBook = {
      id: Date.now(),
      title: formData.title.trim(),
      author: formData.author.trim(),
      genre: formData.genre.trim(),
      isbn: formData.isbn.trim(),
      quantity: Number(formData.quantity),
    };

    if (editingId === null)
    {
        setBooks([...books, newBook]);
        setMessage("Book is added successfuly");

    }
    else
    {
        const updatedBooks = books.map((book) => {
            if(book.id === editingId)
            {
                return {
                    ...book,
                    title: newBook.title,
                    author: newBook.author,
                    genre: newBook.genre,
                    isbn: newBook.isbn,
                    quantity: newBook.quantity,
                };
            }
            return book;
            });
            setBooks(updatedBooks);
            setMessage("Book updated successfully");
        }
        setFormData(emptyForm);
        setEditingId(null);
        setErrors({});

    setTimeout(() => {
      setMessage("");
    }, 3000);
  }

  return (
    <section>
      <h1>Book Management</h1>
      <p>Add and view books in the library catalogue</p>

      <h2>Add New Book</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
            

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter book title"
          />
          {errors.title && <p>{errors.title}</p>}
        </div>

          


        <div>
          <label htmlFor="author">Author</label>
            

          <input
            id="author"
            name="author"
            type="text"
            value={formData.author}
            onChange={handleChange}
            placeholder="Enter author name"
          />
          {errors.author && <p>{errors.author}</p>}
        </div>

          


        <div>
          <label htmlFor="genre">Genre</label>
            

          <input
            id="genre"
            name="genre"
            type="text"
            value={formData.genre}
            onChange={handleChange}
            placeholder="Enter genre"
          />
          {errors.genre && <p>{errors.genre}</p>}
        </div>

          


        <div>
          <label htmlFor="isbn">ISBN</label>
            

          <input
            id="isbn"
            name="isbn"
            type="text"
            value={formData.isbn}
            onChange={handleChange}
            placeholder="Enter 10 or 13 digit ISBN"
          />
          {errors.isbn && <p>{errors.isbn}</p>}
        </div>

          


        <div>
          <label htmlFor="quantity">Initial Quantity</label>
            

          <input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            step="1"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Enter quantity"
          />
          {errors.quantity && <p>{errors.quantity}</p>}
        </div>

          


        <button type="submit">
          {editingId === null ? "Add Book" : "Update Book"}
        </button>

        {message && <p>{message}</p>}
      </form>

      <hr />

      <h2>Book List</h2>

      {books.length === 0 ? (
        <p>No books have been added yet</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>ISBN</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.isbn}</td>
                <td>{book.quantity}</td>
                <td>
                    <button
                      type="button"
                      onClick={() => handleEdit(book)}>
                        Update
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(book.id)}>
                            Delete
                    </button>
                    
                        
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default Books;
