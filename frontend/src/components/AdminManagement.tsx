import { useEffect, useState, type FormEvent } from "react"
import { useAuth } from "../context/AuthContext"
import {
  getAdmins,
  createAdmin,
  deleteAdmin,
  type ApiUser,
} from "../services/api"

export default function AdminManagement() {
  const { user } = useAuth()

  const [admins, setAdmins] = useState<ApiUser[]>([])
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function loadAdmins() {
    try {
      setLoading(true)
      setError("")
      const data = await getAdmins()
      setAdmins(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load admins.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdmins()
  }, [])

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage("")
    setError("")

    try {
      setSaving(true)
      await createAdmin(email.trim(), password)
      setEmail("")
      setPassword("")
      setMessage("New admin account created successfully.")
      await loadAdmins()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create admin.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(admin: ApiUser) {
    const confirmed = window.confirm(
      `Are you sure you want to delete the admin account for ${admin.email}?`,
    )

    if (!confirmed) return

    setMessage("")
    setError("")

    try {
      await deleteAdmin(admin.id)
      setMessage("Admin account deleted successfully.")
      await loadAdmins()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete admin.")
    }
  }

  return (
    <section className="panel admin-management">
      <div className="section-heading">
        <div>
          <h2>Admin Management</h2>
          <p>Create and manage administrator accounts.</p>
        </div>
      </div>

      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}

      <div className="admin-create-section">
        <h3>Create New Admin</h3>

        <form className="form" onSubmit={handleCreate}>
          <label>
            Admin Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
          </label>

          <button type="submit" disabled={saving}>
            {saving ? "Creating..." : "Create Admin"}
          </button>
        </form>
      </div>

      <div className="admin-list-section">
        <div className="section-heading">
          <h3>Existing Admins ({admins.length})</h3>
          <button
            type="button"
            className="secondary"
            onClick={loadAdmins}
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading admins...</p>
        ) : admins.length === 0 ? (
          <p>No admin accounts found.</p>
        ) : (
          <div className="admin-list">
            {admins.map((admin) => (
              <div className="admin-card" key={admin.id}>
                <div>
                  <strong>{admin.email}</strong>
                  <p>
                    Admin #{admin.id} -{" "}
                    {admin.is_active ? "Active" : "Inactive"}
                  </p>
                  {admin.id === user?.id && (
                    <span className="current-admin-label">Your account</span>
                  )}
                </div>

                <button
                  type="button"
                  className="danger"
                  disabled={admin.id === user?.id || admins.length <= 1}
                  onClick={() => handleDelete(admin)}
                  title={
                    admin.id === user?.id
                      ? "You cannot delete your own account"
                      : admins.length <= 1
                        ? "The last admin cannot be deleted"
                        : "Delete admin"
                  }
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
