import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import {
  getUsers,
  updateUserStatus,
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
    loadUsers("")
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

  return (
    <section className="panel user-management">
      <div className="section-heading">
        <div>
          <h2>User Management</h2>
          <p>View, search, activate and deactivate user accounts.</p>
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
            {users.map((targetUser) => (
              <div className="admin-card" key={targetUser.id}>
                <div>
                  <strong>{targetUser.email}</strong>
                  <p>
                    {targetUser.role} #{targetUser.id} -{" "}
                    {targetUser.is_active ? "Active" : "Inactive"}
                  </p>
                  <p>
                    Joined:{" "}
                    {new Date(targetUser.created_at).toLocaleDateString()}
                  </p>
                  {targetUser.id === user?.id && (
                    <span className="current-admin-label">Your account</span>
                  )}
                </div>

                <button
                  type="button"
                  className={targetUser.is_active ? "danger" : "secondary"}
                  disabled={
                    updatingId === targetUser.id ||
                    (targetUser.id === user?.id && targetUser.is_active)
                  }
                  onClick={() => void handleStatusChange(targetUser)}
                  title={
                    targetUser.id === user?.id
                      ? "You cannot deactivate your own account"
                      : targetUser.is_active
                        ? "Deactivate user"
                        : "Activate user"
                  }
                >
                  {updatingId === targetUser.id
                    ? "Updating..."
                    : targetUser.is_active
                      ? "Deactivate"
                      : "Activate"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
