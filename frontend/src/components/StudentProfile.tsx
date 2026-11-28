
import { useEffect, useState } from "react"
import { ApiError, changePassword } from "../services/api"
import { useAuth } from "../context/AuthContext"

export default function StudentProfile() {
  const { user, updateUser } = useAuth()

  const [name, setName] = useState(user?.name ?? "")
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileMessage, setProfileMessage] = useState("")
  const [profileError, setProfileError] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState("")
  const [passwordError, setPasswordError] = useState("")

  useEffect(() => {
    setName(user?.name ?? "")
  }, [user?.name])

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

  async function handleProfileUpdate(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setProfileMessage("")
    setProfileError("")

    if (!name.trim()) {
      setProfileError("Name cannot be empty.")
      return
    }

    if (name.trim().length > 100) {
      setProfileError("Name cannot exceed 100 characters.")
      return
    }

    try {
      setProfileLoading(true)
      await updateUser(name.trim())
      setProfileMessage("Profile updated successfully!")
    } catch (error) {
      setProfileError(
        error instanceof Error
          ? error.message
          : "Failed to update profile.",
      )
    } finally {
      setProfileLoading(false)
    }
  }

  async function handlePasswordChange(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setPasswordMessage("")
    setPasswordError("")

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.")
      return
    }

    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from current password.")
      return
    }

    try {
      setPasswordLoading(true)

      await changePassword(currentPassword, newPassword)

      setPasswordMessage(
        "Password changed successfully. Please log in again if required.",
      )

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setShowCurrentPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)
    } catch (error) {
      if (error instanceof ApiError) {
        setPasswordError(error.message)
      } else {
        setPasswordError(
          error instanceof Error
            ? error.message
            : "Failed to change password.",
        )
      }
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <section className="panel profile-panel">
      <div className="section-heading">
        <div>
          <h2>My Profile</h2>
          <p>Manage your personal information and account security.</p>
        </div>
      </div>

      <div className="profile-header">
        <div className="profile-avatar">
          {(user.name?.trim() || user.email).charAt(0).toUpperCase()}
        </div>

        <div>
          <h3>{user.name || user.email}</h3>
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

      <div className="section-heading">
        <div>
          <h2>Edit Profile</h2>
          <p>Update your display name.</p>
        </div>
      </div>

      <form onSubmit={handleProfileUpdate} className="profile-form">
        <div className="form-group">
          <label htmlFor="profile-name">Full Name</label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your name"
            maxLength={100}
            disabled={profileLoading}
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input type="email" value={user.email} disabled />
        </div>

        {profileMessage && (
          <p className="success-message" role="status">
            {profileMessage}
          </p>
        )}

        {profileError && (
          <p className="error-message" role="alert">
            {profileError}
          </p>
        )}

        <button type="submit" disabled={profileLoading}>
          {profileLoading ? "Saving..." : "Save Profile"}
        </button>
      </form>

      <div className="section-heading">
        <div>
          <h2>Change Password</h2>
          <p>Choose a new password to secure your account.</p>
        </div>
      </div>

      <form onSubmit={handlePasswordChange} className="profile-form">
        <div className="form-group">
          <label htmlFor="current-password">Current Password</label>

          <div className="password-input-wrapper">
            <input
              id="current-password"
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="Enter current password"
              autoComplete="current-password"
              required
              disabled={passwordLoading}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowCurrentPassword((previous) => !previous)
              }
              aria-label={showCurrentPassword ? "Hide password" : "Show password"}
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
                {!showCurrentPassword && <path d="m3 3 18 18" />}
              </svg>
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="new-password">New Password</label>

          <div className="password-input-wrapper">
            <input
              id="new-password"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Enter new password (minimum 8 characters)"
              autoComplete="new-password"
              minLength={8}
              required
              disabled={passwordLoading}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowNewPassword((previous) => !previous)}
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
                {!showNewPassword && <path d="m3 3 18 18" />}
              </svg>
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password">Confirm New Password</label>

          <div className="password-input-wrapper">
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm your new password"
              autoComplete="new-password"
              minLength={8}
              required
              disabled={passwordLoading}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowConfirmPassword((previous) => !previous)
              }
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
                {!showConfirmPassword && <path d="m3 3 18 18" />}
              </svg>
            </button>
          </div>
        </div>

        {passwordMessage && (
          <p className="success-message" role="status">
            {passwordMessage}
          </p>
        )}

        {passwordError && (
          <p className="error-message" role="alert">
            {passwordError}
          </p>
        )}

        <button type="submit" disabled={passwordLoading}>
          {passwordLoading ? "Changing Password..." : "Change Password"}
        </button>
      </form>
    </section>
  )
}
