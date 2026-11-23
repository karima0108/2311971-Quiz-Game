import { useAuth } from "../context/AuthContext"

export default function StudentProfile() {
  const { user } = useAuth()

  if (!user) {
    return <section className="panel">Profile information unavailable.</section>
  }

  const memberSince = new Date(user.created_at).toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  )

  return (
    <section className="panel profile-panel">
      <div className="section-heading">
        <div>
          <h2>My Profile</h2>
          <p>View your account information.</p>
        </div>
      </div>

      <div className="profile-header">
        <div className="profile-avatar">
          {user.email.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3>{user.email}</h3>
          <p>{user.role === "admin" ? "Administrator" : "Student"}</p>
        </div>
      </div>

      <div className="profile-details">
        <div className="profile-detail">
          <span>User ID</span>
          <strong>#{user.id}</strong>
        </div>

        <div className="profile-detail">
          <span>Email Address</span>
          <strong>{user.email}</strong>
        </div>

        <div className="profile-detail">
          <span>Account Role</span>
          <strong>{user.role}</strong>
        </div>

        <div className="profile-detail">
          <span>Account Status</span>
          <strong>{user.is_active ? "Active" : "Inactive"}</strong>
        </div>

        <div className="profile-detail">
          <span>Member Since</span>
          <strong>{memberSince}</strong>
        </div>
      </div>
    </section>
  )
}
