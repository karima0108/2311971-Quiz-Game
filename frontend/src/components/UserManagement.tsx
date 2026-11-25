
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import {
  getUsers,
  getUserDetails,
  updateUserStatus,
  banUser,
  unbanUser,
  changeUserRole,
  type ApiUser,
} from "../services/api"

export default function UserManagement() {
  const { user } = useAuth()

  const [users, setUsers] = useState<ApiUser[]>([])
  const [search, setSearch] = useState("")
  const [appliedSearch, setAppliedSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<"" | "user" | "admin">("")
  const [statusFilter, setStatusFilter] = useState<
    "" | "active" | "inactive" | "banned" | "unbanned"
  >("")

  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const pageSize = 10

  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)

  async function loadUsers(
    searchTerm = appliedSearch,
    role = roleFilter,
    status = statusFilter,
    currentPage = page,
  ) {
    try {
      setLoading(true)
      setError("")

      const data = await getUsers({
        search: searchTerm,
        role: role || undefined,
        status: status || undefined,
        page: currentPage,
        page_size: pageSize,
      })

      setUsers(data.items)
      setTotal(data.total)
      setTotalPages(data.total_pages)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load users.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadUsers("", "", "", 1)
  }, [])

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setAppliedSearch(search)
    setPage(1)
    setMessage("")
    setSelectedUser(null)

    await loadUsers(search, roleFilter, statusFilter, 1)
  }

  async function handleRoleFilter(value: "" | "user" | "admin") {
    setRoleFilter(value)
    setPage(1)
    setSelectedUser(null)

    await loadUsers(appliedSearch, value, statusFilter, 1)
  }

  async function handleStatusFilter(
    value: "" | "active" | "inactive" | "banned" | "unbanned",
  ) {
    setStatusFilter(value)
    setPage(1)
    setSelectedUser(null)

    await loadUsers(appliedSearch, roleFilter, value, 1)
  }

  async function handlePageChange(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages) return

    setPage(nextPage)
    setSelectedUser(null)

    await loadUsers(appliedSearch, roleFilter, statusFilter, nextPage)
  }

  async function handleViewDetails(targetUser: ApiUser) {
    if (selectedUser?.id === targetUser.id) {
      setSelectedUser(null)
      return
    }

    try {
      setDetailsLoading(true)
      setError("")

      const data = await getUserDetails(targetUser.id)
      setSelectedUser(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load user details.",
      )
    } finally {
      setDetailsLoading(false)
    }
  }

  async function handleStatusChange(targetUser: ApiUser) {
    const nextStatus = !targetUser.is_active

    const confirmed = window.confirm(
      `Are you sure you want to ${nextStatus ? "activate" : "deactivate"} ${targetUser.email}?`,
    )

    if (!confirmed) return

    setMessage("")
    setError("")

    try {
      setUpdatingId(targetUser.id)

      await updateUserStatus(targetUser.id, nextStatus)

      setMessage(
        `${targetUser.email} has been ${nextStatus ? "activated" : "deactivated"} successfully.`,
      )

      await loadUsers()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update user status.",
      )
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleBan(targetUser: ApiUser) {
    const reason = window.prompt(
      `Enter a reason for banning ${targetUser.email}:`,
    )

    if (reason === null) return

    if (reason.trim().length < 3) {
      setError("Ban reason must contain at least 3 characters.")
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to ban ${targetUser.email}?`,
    )

    if (!confirmed) return

    setMessage("")
    setError("")

    try {
      setUpdatingId(targetUser.id)

      await banUser(targetUser.id, reason.trim())

      setMessage(`${targetUser.email} has been banned successfully.`)
      await loadUsers()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not ban this user.",
      )
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleUnban(targetUser: ApiUser) {
    const confirmed = window.confirm(
      `Are you sure you want to unban ${targetUser.email}?`,
    )

    if (!confirmed) return

    setMessage("")
    setError("")

    try {
      setUpdatingId(targetUser.id)

      await unbanUser(targetUser.id)

      setMessage(`${targetUser.email} has been unbanned successfully.`)
      await loadUsers()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not unban this user.",
      )
    } finally {
      setUpdatingId(null)
    }
  }

  async function handlePromoteToAdmin(targetUser: ApiUser) {
    const confirmed = window.confirm(
      `Are you sure you want to promote ${targetUser.email} to Admin?`,
    )

    if (!confirmed) return

    setMessage("")
    setError("")

    try {
      setUpdatingId(targetUser.id)

      await changeUserRole(targetUser.id, "admin")

      setMessage(
        `${targetUser.email} has been promoted to Admin successfully.`,
      )

      await loadUsers()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not change user role.",
      )
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <section className="panel user-management">
      <div className="section-heading">
        <div>
          <h2>User Management</h2>
          <p>
            Search, filter, view details and manage user accounts.
          </p>
        </div>
      </div>

      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}

      <form className="form" onSubmit={handleSearch}>
        <label>
          Search by Name or Email
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Enter name or email..."
          />
        </label>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          <button type="submit" disabled={loading}>
            Search
          </button>

          <button
            type="button"
            className="secondary"
            onClick={() => {
              setSearch("")
              setAppliedSearch("")
              setRoleFilter("")
              setStatusFilter("")
              setPage(1)
              setMessage("")
              setSelectedUser(null)
              void loadUsers("", "", "", 1)
            }}
            disabled={loading}
          >
            Clear All
          </button>
        </div>
      </form>

      <div className="user-filters">
        <label>
          Filter by Role
          <select
            value={roleFilter}
            onChange={(event) =>
              void handleRoleFilter(event.target.value as "" | "user" | "admin")
            }
            disabled={loading}
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
        </label>

        <label>
          Filter by Status
          <select
            value={statusFilter}
            onChange={(event) =>
              void handleStatusFilter(
                event.target.value as
                  | ""
                  | "active"
                  | "inactive"
                  | "banned"
                  | "unbanned",
              )
            }
            disabled={loading}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="banned">Banned</option>
            <option value="unbanned">Unbanned</option>
          </select>
        </label>
      </div>

      <div className="admin-list-section">
        <div className="section-heading">
          <div>
            <h3>All Users ({total})</h3>
            <p>
              Page {page} of {Math.max(totalPages, 1)}
            </p>
          </div>

          <button
            type="button"
            className="secondary"
            onClick={() => void loadUsers()}
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="admin-list">
            {users.map((targetUser) => {
              const isCurrentUser = targetUser.id === user?.id
              const isAdmin = targetUser.role === "admin"
              const isUpdating = updatingId === targetUser.id
              const isSelected = selectedUser?.id === targetUser.id

              return (
                <div className="admin-card" key={targetUser.id}>
                  <div>
                    <strong>{targetUser.name || "Unnamed User"}</strong>
                    <p>{targetUser.email}</p>

                    <p>
                      {targetUser.role} #{targetUser.id} -{" "}
                      {targetUser.is_active ? "Active" : "Inactive"}
                    </p>

                    <p>
                      Account status:{" "}
                      {targetUser.is_banned ? "BANNED" : "Not banned"}
                    </p>

                    {targetUser.is_banned && (
                      <>
                        <p>
                          Ban reason: {targetUser.ban_reason || "Not provided"}
                        </p>

                        {targetUser.banned_at && (
                          <p>
                            Banned on:{" "}
                            {new Date(targetUser.banned_at).toLocaleString()}
                          </p>
                        )}
                      </>
                    )}

                    <p>
                      Joined:{" "}
                      {new Date(targetUser.created_at).toLocaleDateString()}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "12px",
                        marginTop: "12px",
                      }}
                    >
                      {isCurrentUser && (
                        <span className="current-admin-label">
                          Your account
                        </span>
                      )}

                      <button
                        type="button"
                        className="secondary"
                        onClick={() => void handleViewDetails(targetUser)}
                        disabled={detailsLoading}
                      >
                        {detailsLoading && isSelected
                          ? "Loading..."
                          : isSelected
                            ? "Hide Details"
                            : "View Details"}
                      </button>
                    </div>

                    {isSelected && selectedUser && (
                      <div className="user-details">
                        <h4>User Details</h4>
                        <p>User ID: {selectedUser.id}</p>
                        <p>Name: {selectedUser.name || "Not provided"}</p>
                        <p>Email: {selectedUser.email}</p>
                        <p>Role: {selectedUser.role}</p>
                        <p>
                          Active: {selectedUser.is_active ? "Yes" : "No"}
                        </p>
                        <p>
                          Banned: {selectedUser.is_banned ? "Yes" : "No"}
                        </p>
                        {selectedUser.banned_by !== null && (
                          <p>Banned by Admin ID: {selectedUser.banned_by}</p>
                        )}
                        <p>
                          Joined:{" "}
                          {new Date(selectedUser.created_at).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "16px",
                      alignItems: "center",
                      marginTop: "16px",
                    }}
                  >
                    <button
                      type="button"
                      className={
                        targetUser.is_active ? "danger" : "secondary"
                      }
                      disabled={
                        isUpdating ||
                        (isCurrentUser && targetUser.is_active)
                      }
                      onClick={() => void handleStatusChange(targetUser)}
                      title={
                        isCurrentUser
                          ? "You cannot deactivate your own account"
                          : targetUser.is_active
                            ? "Deactivate user"
                            : "Activate user"
                      }
                    >
                      {isUpdating
                        ? "Updating..."
                        : targetUser.is_active
                          ? "Deactivate"
                          : "Activate"}
                    </button>

                    {!isAdmin && !isCurrentUser && (
                      <>
                        <button
                          type="button"
                          className="secondary"
                          disabled={
                            isUpdating ||
                            !targetUser.is_active ||
                            targetUser.is_banned
                          }
                          onClick={() =>
                            void handlePromoteToAdmin(targetUser)
                          }
                          title={
                            targetUser.is_banned
                              ? "Unban this user before promoting"
                              : !targetUser.is_active
                                ? "Activate this user before promoting"
                                : "Promote user to Admin"
                          }
                        >
                          {isUpdating ? "Updating..." : "Promote to Admin"}
                        </button>

                        <button
                          type="button"
                          className={
                            targetUser.is_banned ? "secondary" : "danger"
                          }
                          disabled={isUpdating}
                          onClick={() =>
                            void (
                              targetUser.is_banned
                                ? handleUnban(targetUser)
                                : handleBan(targetUser)
                            )
                          }
                        >
                          {isUpdating
                            ? "Updating..."
                            : targetUser.is_banned
                              ? "Unban"
                              : "Ban"}
                        </button>
                      </>
                    )}

                    {isAdmin && (
                      <p>Admin accounts cannot be banned or changed here.</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="user-pagination">
            <button
              type="button"
              className="secondary"
              onClick={() => void handlePageChange(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              className="secondary"
              onClick={() => void handlePageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
