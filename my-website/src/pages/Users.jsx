import { useState } from "react";

const emptyUser = {
  name: "",
  membershipId: "",
  role: "Member",
};

function Users({
  users,
  currentUser,
  setCurrentUser,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
})
{
  const [formData, setFormData] =
    useState(emptyUser);

  const [errors, setErrors] =
    useState({});

  const [editingId, setEditingId] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const isAdministrator =
    currentUser?.role ===
    "Administrator";

  const isLibrarian =
    currentUser?.role ===
    "Librarian";

  const canDeleteUsers =
    isAdministrator ||
    isLibrarian;

  function handleFormChange(event)
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

  function validateUser()
  {
    const newErrors = {};

    if (formData.name.trim() === "")
    {
      newErrors.name =
        "Name is required";
    }

    if (
      formData.membershipId.trim() ===
      ""
    )
    {
      newErrors.membershipId =
        "Membership ID is required";
    }
    else
    {
      const duplicateMembership =
        users.some(
          (user) =>
            user.id !== editingId &&
            user.membershipId
              .toLowerCase() ===
              formData.membershipId
                .trim()
                .toLowerCase()
        );

      if (duplicateMembership)
      {
        newErrors.membershipId =
          "That membership ID is already registered";
      }
    }

    if (formData.role.trim() === "")
    {
      newErrors.role =
        "Role is required";
    }

    return newErrors;
  }

  function handleSubmit(event)
  {
    event.preventDefault();

    if (!isAdministrator)
    {
      setMessage(
        "Only an administrator can add or update users"
      );
      return;
    }

    const formErrors =
      validateUser();

    setErrors(formErrors);
    setMessage("");

    if (
      Object.keys(formErrors)
        .length > 0
    )
    {
      return;
    }

    const result =
      editingId === null
        ? onAddUser(formData)
        : onUpdateUser(
            editingId,
            formData
          );

    if (!result.success)
    {
      setMessage(result.message);
      return;
    }

    setFormData(emptyUser);
    setErrors({});
    setEditingId(null);
    setMessage(result.message);
  }

  function handleEdit(user)
  {
    if (!isAdministrator)
    {
      setMessage(
        "Only an administrator can edit users"
      );
      return;
    }

    setEditingId(user.id);

    setFormData({
      name: user.name,
      membershipId:
        user.membershipId,
      role: user.role,
    });

    setErrors({});
    setMessage("");
  }

  function handleCancelEdit()
  {
    setEditingId(null);
    setFormData(emptyUser);
    setErrors({});
    setMessage("");
  }

  function handleDelete(user)
  {
    if (
      user.role ===
      "Administrator"
    )
    {
      setMessage(
        "Administrator accounts are protected"
      );
      return;
    }

    if (!canDeleteUsers)
    {
      setMessage(
        "Only librarians and administrators can delete users"
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Delete the account for ${user.name}?`
      );

    if (!confirmed)
    {
      return;
    }

    const result =
      onDeleteUser(user.id);

    setMessage(result.message);
  }

  return (
    <section className="page-card">
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            Account directory
          </p>

          <h1>User Management</h1>

          <p className="page-description">
            {isAdministrator
              ? "Administrator mode allows full user management"
              : "Librarian mode allows deletion of normal user accounts"}
          </p>
        </div>

        <div className="heading-badge">
          {currentUser.role}
        </div>
      </div>

      {isAdministrator && (
        <div className="admin-notice">
          <strong>
            Administrator privileges active
          </strong>

          <p>
            You can add update and delete normal
            user accounts The administrator account
            is protected
          </p>
        </div>
      )}

      {isLibrarian && (
        <div className="permission-notice">
          <strong>
            Librarian privileges active
          </strong>

          <p>
            You can delete normal user accounts
            but you cannot add or update users as thats admins work only
          </p>
        </div>
      )}

      <div className="user-management-grid">
        <div className="form-panel">
          <p className="eyebrow">
            This is Admin's responsibility only
          </p>

          <h2>
            {editingId === null
              ? "Add New User"
              : "Update User"}
          </h2>

          <form onSubmit={handleSubmit}>
            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="Enter full name"
              disabled={!isAdministrator}
            />

            {errors.name && (
              <p className="field-error">
                {errors.name}
              </p>
            )}

            <label htmlFor="membershipId">
              Membership ID
            </label>

            <input
              id="membershipId"
              name="membershipId"
              type="text"
              value={
                formData.membershipId
              }
              onChange={handleFormChange}
              placeholder="Example MEM-1001"
              disabled={!isAdministrator}
            />

            {errors.membershipId && (
              <p className="field-error">
                {errors.membershipId}
              </p>
            )}

            <label htmlFor="role">
              Role
            </label>

            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleFormChange}
              disabled={!isAdministrator}
            >
              <option value="Member">
                Member
              </option>

              <option value="Librarian">
                Librarian
              </option>

              <option value="Administrator">
                Administrator
              </option>
            </select>

            {errors.role && (
              <p className="field-error">
                {errors.role}
              </p>
            )}

            <div className="form-actions">
              <button
                type="submit"
                disabled={!isAdministrator}
              >
                {editingId === null
                  ? "Add User"
                  : "Update User"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={
                    handleCancelEdit
                  }
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {message && (
            <p className="success-message">
              {message}
            </p>
          )}
        </div>

        <div className="directory-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">
                Registered people
              </p>

              <h2>User Directory</h2>
            </div>

            <span className="heading-badge">
              {users.length} people
            </span>
          </div>

          <div className="user-list">
            {users.map((user) =>
            {
              const isProtected =
                user.role ===
                "Administrator";

              return (
                <div
                  className="user-card"
                  key={user.id}
                >
                  <div className="user-avatar">
                    {user.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="user-details">
                    <h3>{user.name}</h3>

                    <p>
                      {user.membershipId}
                    </p>

                    <span
                      className={
                        `role-badge role-` +
                        user.role.toLowerCase()
                      }
                    >
                      {user.role}
                    </span>
                  </div>

                  <div className="user-actions">
                    {isAdministrator && (
                      <button
                        type="button"
                        className="small-button"
                        onClick={() =>
                          handleEdit(user)
                        }
                      >
                        Edit
                      </button>
                    )}

                    <button
                      type="button"
                      className="danger-button small-button"
                      onClick={() =>
                        handleDelete(user)
                      }
                      disabled={
                        !canDeleteUsers ||
                        isProtected
                      }
                      title={
                        isProtected
                          ? "Administrator accounts are protected"
                          : "Delete user"
                      }
                    >
                      {isProtected
                        ? "Protected"
                        : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Users;
