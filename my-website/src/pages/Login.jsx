import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ users, onLogin })
{
  const navigate = useNavigate();

  const [role, setRole] = useState("Guest");
  const [name, setName] = useState("");
  const [membershipId, setMembershipId] =
    useState("");

  const [error, setError] = useState("");
  const [accountExists, setAccountExists] = useState("login");

  function handleSubmit(event)
  {
    event.preventDefault();
    setError("");
    if(membershipId.trim() === "")
    {
      setError("You are required to identify yourself");
      return;
    }
    if(accountExists === "signup" && name.trim() === "")
    {
      setError("New Users are required to provide their names");
      return;
    }
    if(accountExists === "signup")
    {
      const newGuest = {
        id: `guest-${Date.now()}`,
        name: name.trim(),
        membershipId: membershipId.trim(),
        role: "Guest",
      };
      onLogin(newGuest);
      navigate("/");
      return;
    }

    const existingUser = users.find(
      (user) =>
        user.membershipId.toLowerCase() ===
        membershipId.trim().toLowerCase() &&
        user.role === role
    );

    if (!existingUser)
    {
      setError(
        "No user found with the provided identification details"
      );
      return;
    }
    
    onLogin(existingUser);
    navigate("/");
  }
    

  return (
    <section className="page-card login-page">
      <div className="login-page-heading">
        <p className="eyebrow">
          <b>LOGIN</b>
        </p>

        <h1>WELCOME TO LUCT COMMUNITY LIBRARY</h1>

        <p className="page-description">
          Choose your role and enter the required
          identification details
        </p>
      </div>

      <form
        className="login-page-form"
        onSubmit={handleSubmit}
      >
        <label htmlFor="loginRole">
          Login role
        </label>

        <select
          id="loginRole"
          value={role}
          onChange={(event) =>
          {
            setRole(event.target.value);
            setError("");
          }}
        >
          <option value="Guest">
            Guest
          </option>

          <option value="Librarian">
            Librarian
          </option>

          <option value="Administrator">
            Administrator
          </option>
        </select>

        {role === "Guest" && (
          <>
            
            <label htmlFor="logiOrSignup">
              Do you have an account with us already? 
            </label>
            <select
              id="logiOrSignup"
              value={accountExists}
              onChange={(event) =>
              {
                setAccountExists(event.target.value);
                setError("");
                setName("");
                setMembershipId("");
              }}
            >
              <option value="login">
                Login
              </option>
              <option value="signup">
                Sign up
              </option>
            </select>
            
            {accountExists === "signup" && (
              <>
                <label htmlFor="guestName">
                  Names
                </label>

                <input
                  id="guestName"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter your full name"
                />
              </>
            )
                
            }
          </>
        )}

        <label htmlFor="membershipId">
          {role === "Guest"
            ? "Guest identification ID"
            : "Membership ID"}
        </label>

        <input
          id="membershipId"
          type="text"
          value={membershipId}
          onChange={(event) =>
            setMembershipId(event.target.value)
          }
          placeholder={
            role === "Administrator"
              ? "MOTUBA'S ID"
              : role === "Librarian"
                ? "Example: LIBRARIAN2010"
                : "Example: GUEST-001"
          }

        />
        
        


        {role === "Administrator" && (
          <p className="login-hint">
            Administrator hint: WHAT IS MY STUDENT NUMBER?
          </p>
        )}

        {role === "Librarian" && (
          <p className="login-hint">
            Librarian demo ID: ROLE (IN CAPS) + CURRENT YEAR
          </p>
        )}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <button type="submit">
          Continue
        </button>
      </form>
    </section>
  );
}

export default Login;
