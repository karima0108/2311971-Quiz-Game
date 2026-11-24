
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import {
  getUsers,
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
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function loadUsers(searchTerm = search) {
    try {
      setLoading(true)
      setError("")
      const data = await getUsers(searchTerm)
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load users.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadUsers("")
  }, [])

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage("")
    await loadUsers(search)
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

      await loadUsers(search)
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
      await loadUsers(search)
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
      await loadUsers(search)
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

      await loadUsers(search)
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
            View, search, activate, deactivate, ban, unban and promote user
            accounts.
          </p>
        </div>
      </div>

      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}

      <form className="form" onSubmit={handleSearch}>
        <label>
          Search by Email
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Enter user email..."
          />
        </label>

        <div>
          <button type="submit" disabled={loading}>
            Search
          </button>

          <button
            type="button"
            className="secondary"
            onClick={() => {
              setSearch("")
              setMessage("")
              void loadUsers("")
            }}
            disabled={loading}
          >
            Clear
          </button>
        </div>
      </form>

      <div className="admin-list-section">
        <div className="section-heading">
          <h3>All Users ({users.length})</h3>

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

              return (
                <div className="admin-card" key={targetUser.id}>
                  <div>
                    <strong>{targetUser.email}</strong>

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

                    {isCurrentUser && (
                      <span className="current-admin-label">
                        Your account
                      </span>
                    )}
                  </div>

                  <div>
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
      </div>
    </section>
  )
}
