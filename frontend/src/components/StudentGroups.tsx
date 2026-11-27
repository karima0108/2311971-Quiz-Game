
import { useEffect, useState, type FormEvent } from "react";

import {
  getMyGroups,
  createMyGroup,
  updateMyGroup,
  deleteMyGroup,
  getMyGroupMembers,
  addMyGroupMember,
  removeMyGroupMember,
  type StudentGroup,
  type GroupMember,
} from "../services/api";

import { useAuth } from "../context/AuthContext";

function StudentGroups() {
  const { user } = useAuth();

  const [groups, setGroups] = useState<StudentGroup[]>([]);
  const [members, setMembers] = useState<GroupMember[]>([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedGroupId, setSelectedGroupId] =
    useState<number | null>(null);

  // Create group form
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  // Edit group form
  const [editingGroupId, setEditingGroupId] =
    useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Member form
  const [memberEmail, setMemberEmail] = useState("");

  const selectedGroup = groups.find(
    (group) => group.id === selectedGroupId
  );

  const isOwner =
    !!selectedGroup && user?.id === selectedGroup.owner_id;

  async function loadMyGroups() {
    try {
      setLoading(true);
      setError("");

      const data = await getMyGroups();
      setGroups(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load your groups"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadMyGroups();
  }, []);

  // =========================
  // CREATE GROUP
  // =========================

  async function handleCreateGroup(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await createMyGroup({
        name: groupName.trim(),
        description: groupDescription.trim() || null,
      });

      setGroupName("");
      setGroupDescription("");

      await loadMyGroups();

      setSuccess("Group created successfully!");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not create group"
      );
    } finally {
      setActionLoading(false);
    }
  }

  // =========================
  // EDIT GROUP
  // =========================

  function startEditing(group: StudentGroup) {
    setEditingGroupId(group.id);
    setEditName(group.name);
    setEditDescription(group.description || "");
    setError("");
    setSuccess("");
  }

  async function handleUpdateGroup(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (editingGroupId === null) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await updateMyGroup(editingGroupId, {
        name: editName.trim(),
        description: editDescription.trim() || null,
      });

      setEditingGroupId(null);
      setEditName("");
      setEditDescription("");

      await loadMyGroups();

      setSuccess("Group updated successfully!");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not update group"
      );
    } finally {
      setActionLoading(false);
    }
  }

  function cancelEditing() {
    setEditingGroupId(null);
    setEditName("");
    setEditDescription("");
  }

  // =========================
  // DELETE GROUP
  // =========================

  async function handleDeleteGroup(groupId: number) {
    if (!window.confirm("Are you sure you want to delete this group?")) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await deleteMyGroup(groupId);

      setSelectedGroupId(null);
      setMembers([]);
      cancelEditing();

      await loadMyGroups();

      setSuccess("Group deleted successfully!");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not delete group"
      );
    } finally {
      setActionLoading(false);
    }
  }

  // =========================
  // SELECT GROUP
  // =========================

  async function handleSelectGroup(group: StudentGroup) {
    const nextGroupId =
      selectedGroupId === group.id ? null : group.id;

    setSelectedGroupId(nextGroupId);
    setMembers([]);
    setMemberEmail("");
    cancelEditing();
    setError("");
    setSuccess("");

    if (nextGroupId === null) return;

    if (user?.id !== group.owner_id) return;

    try {
      const data = await getMyGroupMembers(group.id);
      setMembers(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load group members"
      );
    }
  }

  // =========================
  // ADD MEMBER USING EMAIL
  // =========================

  async function handleAddMember(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!selectedGroup || !memberEmail.trim()) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await addMyGroupMember(
        selectedGroup.id,
        memberEmail.trim().toLowerCase()
      );

      setMemberEmail("");

      const updatedMembers = await getMyGroupMembers(
        selectedGroup.id
      );

      setMembers(updatedMembers);

      setSuccess("Student added to the group successfully!");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not add student"
      );
    } finally {
      setActionLoading(false);
    }
  }

  // =========================
  // REMOVE MEMBER
  // =========================

  async function handleRemoveMember(userId: number) {
    if (!selectedGroup) return;

    if (!window.confirm("Remove this student from the group?")) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await removeMyGroupMember(selectedGroup.id, userId);

      const updatedMembers = await getMyGroupMembers(
        selectedGroup.id
      );

      setMembers(updatedMembers);

      setSuccess("Student removed from the group.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not remove student"
      );
    } finally {
      setActionLoading(false);
    }
  }

  // =========================
  // UI
  // =========================

  return (
    <section className="panel group-management">
      <div className="section-heading">
        <div>
          <h2>My Groups</h2>
          <p>Create and manage your student groups.</p>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <p>{success}</p>}

      {/* CREATE GROUP */}

      <form
        className="group-create-form"
        onSubmit={handleCreateGroup}
      >
        <h3>Create a New Group</h3>

        <div className="form-group">
          <label htmlFor="student-group-name">
            Group Name
          </label>

          <input
            id="student-group-name"
            type="text"
            value={groupName}
            onChange={(event) =>
              setGroupName(event.target.value)
            }
            placeholder="Enter group name"
            maxLength={100}
            required
            disabled={actionLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="student-group-description">
            Description
          </label>

          <textarea
            id="student-group-description"
            value={groupDescription}
            onChange={(event) =>
              setGroupDescription(event.target.value)
            }
            placeholder="Enter group description"
            maxLength={500}
            disabled={actionLoading}
          />
        </div>

        <button type="submit" disabled={actionLoading}>
          {actionLoading ? "Please wait..." : "Create Group"}
        </button>
      </form>

      {/* GROUP LIST */}

      <div className="group-list-section">
        <h3>Your Groups</h3>

        {loading ? (
          <p>Loading your groups...</p>
        ) : groups.length === 0 ? (
          <p>
            You have not created or joined any groups yet.
          </p>
        ) : (
          <div className="group-list">
            {groups.map((group) => (
              <article
                className="group-select"
                key={group.id}
              >
                <strong>{group.name}</strong>

                <span>
                  {group.description ||
                    "No description available."}
                </span>

                <span>
                  {user?.id === group.owner_id
                    ? "Group Owner"
                    : "Group Member"}
                </span>

                <button
                  type="button"
                  onClick={() => void handleSelectGroup(group)}
                >
                  {selectedGroupId === group.id
                    ? "Hide Details"
                    : "View Details"}
                </button>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* SELECTED GROUP DETAILS */}

      {selectedGroup && (
        <div className="group-details">
          <div className="section-heading">
            <div>
              <h3>{selectedGroup.name}</h3>

              <p>
                {selectedGroup.description ||
                  "No description available."}
              </p>
            </div>

            {isOwner && <span>Owner Controls</span>}
          </div>

          {/* GROUP PERMISSIONS */}

          <div>
            <strong>Assigned Permissions:</strong>

            {selectedGroup.permissions.length > 0 ? (
              <ul>
                {selectedGroup.permissions.map(
                  (permission) => (
                    <li key={permission}>
                      {permission}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p>
                No permissions assigned to this group.
              </p>
            )}
          </div>

          {/* OWNER-ONLY ACTIONS */}

          {isOwner && (
            <>
              {/* MANAGE GROUP */}

              <div className="group-subsection">
                <h3>Manage Group</h3>

                <button
                  type="button"
                  onClick={() => startEditing(selectedGroup)}
                  disabled={actionLoading}
                >
                  Edit Group
                </button>

                <button
                  type="button"
                  className="danger-button"
                  onClick={() =>
                    void handleDeleteGroup(selectedGroup.id)
                  }
                  disabled={actionLoading}
                >
                  Delete Group
                </button>

                {editingGroupId === selectedGroup.id && (
                  <form
                    className="group-inline-form"
                    onSubmit={handleUpdateGroup}
                  >
                    <input
                      type="text"
                      value={editName}
                      onChange={(event) =>
                        setEditName(event.target.value)
                      }
                      placeholder="Group name"
                      maxLength={100}
                      required
                      disabled={actionLoading}
                    />

                    <input
                      type="text"
                      value={editDescription}
                      onChange={(event) =>
                        setEditDescription(event.target.value)
                      }
                      placeholder="Group description"
                      maxLength={500}
                      disabled={actionLoading}
                    />

                    <button
                      type="submit"
                      disabled={actionLoading}
                    >
                      Save Changes
                    </button>

                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={actionLoading}
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </div>

              {/* MANAGE MEMBERS */}

              <div className="group-subsection">
                <h3>Manage Members</h3>

                <form
                  className="group-inline-form"
                  onSubmit={handleAddMember}
                >
                  <input
                    type="email"
                    value={memberEmail}
                    onChange={(event) =>
                      setMemberEmail(event.target.value)
                    }
                    placeholder="Enter student's registered email"
                    required
                    disabled={actionLoading}
                  />

                  <button
                    type="submit"
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Please wait..." : "Add Member"}
                  </button>
                </form>

                <h4>Group Members</h4>

                {members.length === 0 ? (
                  <p>No members found.</p>
                ) : (
                  <ul className="group-item-list">
                    {members.map((member) => (
                      <li key={member.id}>
                        <div>
                          <strong>{member.name}</strong>

                          <span>{member.email}</span>

                          <span>
                            {member.id === selectedGroup.owner_id
                              ? "Group Owner"
                              : "Student Member"}
                          </span>
                        </div>

                        {member.id !== selectedGroup.owner_id && (
                          <button
                            type="button"
                            className="danger-button"
                            onClick={() =>
                              void handleRemoveMember(member.id)
                            }
                            disabled={actionLoading}
                          >
                            Remove
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}

export default StudentGroups;
