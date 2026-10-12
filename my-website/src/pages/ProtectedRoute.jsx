import { Navigate } from "react-router-dom";

function ProtectedRoute({
  currentUser,
  allowedRoles,
  children,
})
{
  if (!currentUser)
  {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (!allowedRoles.includes(currentUser.role))
  {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
