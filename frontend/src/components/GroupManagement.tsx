
import { useEffect, useState } from "react"
import {
  getGroups,
  createGroup,
  deleteGroup,
  getGroupMembers,
  addGroupMember,
  removeGroupMember,
  getGroupPermissions,
  assignGroupPermission,
  revokeGroupPermission,
  getUsers,
  type Group,
  type GroupMember,
  type ApiUser,
} from "../services/api"

function GroupManagement() {
  const [groups, setGroups] = useState<Group[]>([])
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [members, setMembers] = useState<GroupMember[]>([])
  const [permissions, setPermissions] = useState<string[]>([])
  const [students, setStudents] = useState<ApiUser[]>([])

  const [groupName, setGroupName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("")
  const [permission, setPermission] = useState("")

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function loadGroups() {
    try {
      setLoading(true)
      const data = await getGroups()
      setGroups(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load groups")
    } finally {
      setLoading(false)
    }
  }

  async function loadGroupDetails(group: Group) {
    setSelectedGroup(group)
    setMessage("")
    setError("")

    try {
      const [memberData, permissionData] = await Promise.all([
        getGroupMembers(group.id),
        getGroupPermissions(group.id),
      ])

      setMembers(memberData)
      setPermissions(permissionData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load group details")
    }
  }

  async function loadStudents() {
    try {
      const data = await getUsers({
        role: "user",
        status: "unbanned",
        page: 1,
        page_size: 100,
      })
      setStudents(data.items.filter((student) => student.is_active))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load students")
    }
  }

  useEffect(() => {
    void loadGroups()
    void loadStudents()
  }, [])

  async function handleCreateGroup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage("")
    setError("")

    try {
      const group = await createGroup({
        name: groupName.trim(),
        description: description.trim() || null,
      })

      setGroupName("")
      setDescription("")
      setMessage("Group created successfully!")
      await loadGroups()
      await loadGroupDetails(group)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create group")
    }
  }

  async function handleDeleteGroup() {
    if (!selectedGroup) return

    if (!window.confirm(`Delete group "${selectedGroup.name}"?`)) return

    try {
      await deleteGroup(selectedGroup.id)
      setSelectedGroup(null)
      setMembers([])
      setPermissions([])
      setMessage("Group deleted successfully!")
      await loadGroups()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete group")
    }
  }

  async function handleAddStudent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedGroup || !selectedStudent) return

    try {
      await addGroupMember(selectedGroup.id, Number(selectedStudent))
      setSelectedStudent("")
      setMessage("Student added successfully!")
      await loadGroupDetails(selectedGroup)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add student")
    }
  }

  async function handleRemoveStudent(userId: number) {
    if (!selectedGroup) return

    if (!window.confirm("Remove this student from the group?")) return

    try {
      await removeGroupMember(selectedGroup.id, userId)
      setMessage("Student removed successfully!")
      await loadGroupDetails(selectedGroup)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove student")
    }
  }

  async function handleAssignPermission(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedGroup || !permission.trim()) return

    try {
      await assignGroupPermission(selectedGroup.id, permission.trim())
      setPermission("")
      setMessage("Permission assigned successfully!")
      await loadGroupDetails(selectedGroup)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not assign permission")
    }
  }

  async function handleRevokePermission(value: string) {
    if (!selectedGroup) return

    if (!window.confirm(`Revoke "${value}" permission?`)) return

    try {
      await revokeGroupPermission(selectedGroup.id, value)
      setMessage("Permission revoked successfully!")
      await loadGroupDetails(selectedGroup)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not revoke permission")
    }
  }

  const availableStudents = students.filter(
    (student) => !members.some((member) => member.id === student.id),
  )

  return (
    <section className="panel group-management">
      <div className="section-heading">
        <div>
          <h2>Group Management</h2>
          <p>Create groups, manage student membership, and assign permissions.</p>
        </div>
      </div>

      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}

      <form className="form group-create-form" onSubmit={handleCreateGroup}>
        <h3>Create New Group</h3>

        <label>
          Group Name
          <input
            value={groupName}
            onChange={(event) => setGroupName(event.target.value)}
            placeholder="e.g. CSE Spring 2026"
            maxLength={100}
            required
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Short group description (optional)"
            maxLength={500}
          />
        </label>

        <button type="submit">Create Group</button>
      </form>

      <div className="group-list-section">
        <h3>All Groups ({groups.length})</h3>

        {loading ? (
          <p>Loading groups...</p>
        ) : groups.length === 0 ? (
          <p>No groups created yet.</p>
        ) : (
          <div className="group-list">
            {groups.map((group) => (
              <button
                key={group.id}
                type="button"
                className={
                  selectedGroup?.id === group.id
                    ? "group-select active"
                    : "group-select secondary"
                }
                onClick={() => void loadGroupDetails(group)}
              >
                <strong>{group.name}</strong>
                <span>{group.description || "No description"}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedGroup && (
        <div className="group-details">
          <div className="section-heading">
            <div>
              <h3>{selectedGroup.name}</h3>
              <p>{selectedGroup.description || "No description provided."}</p>
            </div>
            <button type="button" className="danger-button" onClick={() => void handleDeleteGroup()}>
              Delete Group
            </button>
          </div>

          <div className="group-subsection">
            <h3>Students ({members.length})</h3>

            <form className="group-inline-form" onSubmit={handleAddStudent}>
              <select
                value={selectedStudent}
                onChange={(event) => setSelectedStudent(event.target.value)}
                required
              >
                <option value="">Select a student</option>
                {availableStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name || student.email} — {student.email}
                  </option>
                ))}
              </select>
              <button type="submit" disabled={!selectedStudent}>
                Add Student
              </button>
            </form>

            {members.length === 0 ? (
              <p>No students in this group yet.</p>
            ) : (
              <ul className="group-item-list">
                {members.map((member) => (
                  <li key={member.id}>
                    <div>
                      <strong>{member.name || "Unnamed student"}</strong>
                      <span>{member.email}</span>
                    </div>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => void handleRemoveStudent(member.id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="group-subsection">
            <h3>Group Permissions ({permissions.length})</h3>

            <form className="group-inline-form" onSubmit={handleAssignPermission}>
              <input
                value={permission}
                onChange={(event) => setPermission(event.target.value)}
                placeholder="e.g. group:resources:read"
                maxLength={100}
                required
              />
              <button type="submit">Assign Permission</button>
            </form>

            {permissions.length === 0 ? (
              <p>No permissions assigned yet.</p>
            ) : (
              <ul className="group-item-list">
                {permissions.map((item) => (
                  <li key={item}>
                    <strong>{item}</strong>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => void handleRevokePermission(item)}
                    >
                      Revoke
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default GroupManagement
