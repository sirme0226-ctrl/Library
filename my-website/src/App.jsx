import { useEffect, useState } from "react";
import {
  NavLink,
  Route,
  Routes,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Login from "./pages/Login";
import ProtectedRoute from "./pages/ProtectedRoute";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users";


const ADMIN_MEMBERSHIP_ID =
  "901020639";

const initialBooks = [
  {
    id: 1,
    title: "Things Fall Apart",
    author: "Chinua Achebe",
    genre: "Fiction",
    isbn: "9780385474542",
    quantity: 3,
  },
  {
    id: 2,
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
    isbn: "9780062315007",
    quantity: 1,
  },
];

const initialUsers = [
  {
    id: "admin-1",
    name: "Admin: Motuba",
    membershipId: ADMIN_MEMBERSHIP_ID,
    role: "Administrator",
  },
  {
    id: "librarian-1",
    name: "Mr. Tsukulu",
    membershipId: "LIBRARIAN2026",
    role: "Librarian",
  },
];

function getSavedData(
  storageKey,
  defaultValue
)
{
  try
  {
    const savedData =
      localStorage.getItem(storageKey);

    if (savedData)
    {
      return JSON.parse(savedData);
    }

    return defaultValue;
  }
  catch
  {
    return defaultValue;
  }
}

function loadUsers()
{
  const savedUsers = getSavedData(
    "libraryUsers",
    initialUsers
  );

  const uniqueUsers = [];
  const usedMembershipIds = new Set();

  savedUsers.forEach((user) =>
  {
    const membershipId =
      user.membershipId
        ?.trim()
        .toLowerCase();

    const uniqueKey =
      membershipId || user.id;

    if (usedMembershipIds.has(uniqueKey))
    {
      return;
    }

    usedMembershipIds.add(uniqueKey);

    uniqueUsers.push(user);
  });

  const updatedUsers = uniqueUsers.map((user) =>
  {
    if (
      user.id === "admin-1" ||
      user.id === 1
    )
    {
      return {
        ...user,
        id: "admin-1",
        name: "Admin: Motuba",
        membershipId:
          ADMIN_MEMBERSHIP_ID,
        role: "Administrator",
      };
    }

    return user;
  });

  const administratorExists =
    updatedUsers.some(
      (user) =>
        user.role === "Administrator"
    );

  if (!administratorExists)
  {
    return [
      initialUsers[0],
      ...updatedUsers,
    ];
  }

  return updatedUsers;
}


function App()
{
  const [books, setBooks] = useState(() =>
    getSavedData(
      "libraryBooks",
      initialBooks
    )
  );

  const [users, setUsers] = useState(loadUsers);

  const [transactions, setTransactions] =
    useState(() =>
      getSavedData(
        "libraryTransactions",
        []
      )
    );

  const [currentUser, setCurrentUser] =
    useState(() =>
      getSavedData(
        "libraryCurrentUser",
        null
      )
    );

  useEffect(() =>
  {
    localStorage.setItem(
      "libraryBooks",
      JSON.stringify(books)
    );
  }, [books]);

  useEffect(() =>
  {
    localStorage.setItem(
      "libraryUsers",
      JSON.stringify(users)
    );
  }, [users]);

  useEffect(() =>
  {
    localStorage.setItem(
      "libraryTransactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  useEffect(() =>
  {
    if (currentUser?.role === "Guest")
    {
      return;
    }

    localStorage.setItem(
      "libraryCurrentUser",
      JSON.stringify(currentUser)
    );
  }, [currentUser]);
  
  //on login as a guest, save the user to the existing users array
  function handleLogin(user)
  {
    if (user.role !== "Guest")
    {
      setCurrentUser(user);

      return;
    }

    const normalizedMembershipId =
      user.membershipId
        .trim()
        .toLowerCase();

    const existingGuest = users.find(
      (savedUser) =>
        savedUser.role === "Guest" &&
        savedUser.membershipId
          .trim()
          .toLowerCase() ===
          normalizedMembershipId
    );

    const guestToSave = existingGuest
      ? {
          ...existingGuest,
          name: user.name.trim(),
          membershipId:
            user.membershipId.trim(),
          role: "Guest",
        }
      : {
          ...user,
          name: user.name.trim(),
          membershipId:
            user.membershipId.trim(),
          role: "Guest",
        };

    setUsers((currentUsers) =>
    {
      const updatedUsers = [];
      let guestAdded = false;

      currentUsers.forEach((savedUser) =>
      {
        const savedMembershipId =
          savedUser.membershipId
            ?.trim()
            .toLowerCase();

        if (
          savedUser.role === "Guest" &&
          savedMembershipId ===
            normalizedMembershipId
        )
        {
          if (!guestAdded)
          {
            updatedUsers.push(guestToSave);
            guestAdded = true;
          }

          return;
        }

        updatedUsers.push(savedUser);
      });

      if (!guestAdded)
      {
        updatedUsers.push(guestToSave);
      }

      return updatedUsers;
    });

    setCurrentUser(guestToSave);
  }


  function handleLogout()
  {
    setCurrentUser(null);
    localStorage.removeItem(
      "libraryCurrentUser"
    );
    
  }

  function handleStockChange(
  bookId,
  transactionType,
  quantity,
  note,
  by
)
{
  const amount = Number(quantity);

  if (
    !Number.isInteger(amount) ||
    amount <= 0
  )
  {
    return {
      success: false,
      message:
        "Quantity must be a whole number greater than zero",
    };
  }

  const selectedBook = books.find(
    (book) => book.id === bookId
  );

  if (!selectedBook)
  {
    return {
      success: false,
      message:
        "The selected book could not be found",
    };
  }

  if (
    transactionType === "borrow" &&
    amount > selectedBook.quantity
  )
  {
    return {
      success: false,
      message:
        `Only ${selectedBook.quantity} copies are available`,
    };
  }

  const newQuantity =
    transactionType === "arrival"
      ? selectedBook.quantity + amount
      : selectedBook.quantity - amount;

  const updatedBooks = books.map((book) =>
  {
    if (book.id === bookId)
    {
      return {
        ...book,
        quantity: newQuantity,
      };
    }

    return book;
  });

  setBooks(updatedBooks);

  const newTransaction = {
    id: Date.now(),
    bookId: selectedBook.id,
    bookTitle: selectedBook.title,
    type: transactionType,
    quantity: amount,
    by: by?.trim() || "Not specified",
    note: note?.trim() || "",
    date: new Date().toISOString(),
  };

  setTransactions((currentTransactions) =>
  {
    return [
      newTransaction,
      ...currentTransactions,
    ];
  });

  return {
    success: true,
    message:
      "Transaction saved successfully",
  };
}


  function handleAddUser(userDetails)
  {
    if (
      currentUser?.role !==
      "Administrator"
    )
    {
      return {
        success: false,
        message:
          "Only an administrator can add users",
      };
    }

    const membershipAlreadyExists =
      users.some(
        (user) =>
          user.membershipId.toLowerCase() ===
          userDetails.membershipId
            .trim()
            .toLowerCase()
      );

    if (membershipAlreadyExists)
    {
      return {
        success: false,
        message:
          "That membership ID is already registered",
      };
    }

    const newUser = {
      id: Date.now(),
      name: userDetails.name.trim(),
      membershipId:
        userDetails.membershipId.trim(),
      role: userDetails.role,
    };

    setUsers((currentUsers) =>
    {
      return [
        ...currentUsers,
        newUser,
      ];
    });

    return {
      success: true,
      message:
        "User added successfully",
    };
  }

  function handleUpdateUser(
    userId,
    userDetails
  )
  {
    if (
      currentUser?.role !==
      "Administrator"
    )
    {
      return {
        success: false,
        message:
          "Only an administrator can update users",
      };
    }

    const duplicateMembership =
      users.some(
        (user) =>
          user.id !== userId &&
          user.membershipId.toLowerCase() ===
            userDetails.membershipId
              .trim()
              .toLowerCase()
      );

    if (duplicateMembership)
    {
      return {
        success: false,
        message:
          "That membership ID is already registered",
      };
    }

    const updatedUsers = users.map((user) =>
    {
      if (user.id === userId)
      {
        return {
          ...user,
          name: userDetails.name.trim(),
          membershipId:
            userDetails.membershipId.trim(),
          role:
            user.role === "Administrator"
              ? "Administrator"
              : userDetails.role,
        };
      }

      return user;
    });

    setUsers(updatedUsers);

    if (currentUser?.id === userId)
    {
      const updatedCurrentUser =
        updatedUsers.find(
          (user) =>
            user.id === userId
        );

      setCurrentUser(
        updatedCurrentUser
      );
    }

    return {
      success: true,
      message:
        "User updated successfully",
    };
  }

  function handleDeleteUser(userId)
  {
    const currentRole =
      currentUser?.role;

    if (
      currentRole !== "Administrator" &&
      currentRole !== "Librarian"
    )
    {
      return {
        success: false,
        message:
          "Only librarians and administrators can delete users",
      };
    }

    const selectedUser = users.find(
      (user) =>
        user.id === userId
    );

    if (!selectedUser)
    {
      return {
        success: false,
        message:
          "The selected user could not be found",
      };
    }

    if (
      selectedUser.role ===
      "Administrator"
    )
    {
      return {
        success: false,
        message:
          "Administrator accounts are protected",
      };
    }

    setUsers((currentUsers) =>
    {
      return currentUsers.filter(
        (user) =>
          user.id !== userId
      );
    });

    return {
      success: true,
      message:
        "User deleted successfully",
    };
  }

  return (
    <div className="app">
      <header className="site-header">
        <div className="brand">
          <div className="brand-mark">
            
          </div>

          <div>
            <h1>Community Library</h1>
            <p id = "me"><b>LUCT OPEN-ACCESS LIBRARY</b></p>
          </div>
        </div>

        <nav className="main-navigation">
          <NavLink to="/" end>
            Dashboard
          </NavLink>

          {currentUser &&
            currentUser.role !==
              "Guest" && (
              <>
                <NavLink to="/books">
                  Books
                </NavLink>

                <NavLink to="/transactions">
                  Transactions
                </NavLink>
              </>
            )}

          {currentUser &&
            (
              currentUser.role ===
                "Librarian" ||
              currentUser.role ===
                "Administrator"
            ) && (
              <NavLink to="/users">
                Users
              </NavLink>
            )}

          {!currentUser && (
            <NavLink to="/login">
              Login
            </NavLink>
          )}
        </nav>

        <div className="header-session">
          {currentUser ? (
            <>
              <span>
                Signed in as{" "}
                <strong>
                  {currentUser.name}
                </strong>
              </span>

              <button
                type="button"
                className="small-button"
                onClick={handleLogout}
              >
                Sign out
              </button>
            </>
          ) : (
            <span>Guest session</span>
          )}
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                books={books}
                currentUser={currentUser}
                onStockChange={
                  handleStockChange
                }
              />
            }
          />

          <Route
            path="/login"
            element={
              <Login
                users={users}
                onLogin={handleLogin}
              />
            }
          />

          <Route
            path="/books"
            element={
              <ProtectedRoute
                currentUser={currentUser}
                allowedRoles={[
                  "Librarian",
                  "Administrator",
                ]}
              >
                <Books
                  books={books}
                  setBooks={setBooks}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions"
            element={
              <ProtectedRoute
                currentUser={currentUser}
                allowedRoles={[
                  "Librarian",
                  "Administrator",
                ]}
              >
                <Transactions
                  books={books}
                  onStockChange={
                    handleStockChange
                  }
                  transactions={
                    transactions
                  }
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute
                currentUser={currentUser}
                allowedRoles={[
                  "Librarian",
                  "Administrator",
                ]}
              >
                <Users
                  users={users}
                  currentUser={
                    currentUser
                  }
                  setCurrentUser={
                    setCurrentUser
                  }
                  onAddUser={
                    handleAddUser
                  }
                  onUpdateUser={
                    handleUpdateUser
                  }
                  onDeleteUser={
                    handleDeleteUser
                  }
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <footer className="site-footer">
        <p>
          
        </p>
      </footer>
    </div>
  );
}

export default App;
