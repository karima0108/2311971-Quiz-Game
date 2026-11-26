
import { useEffect, useState } from "react";
import { getMyGroups, type StudentGroup } from "../services/api";

function StudentGroups() {
  const [groups, setGroups] = useState<StudentGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  useEffect(() => {
    async function loadMyGroups() {
      try {
        setLoading(true);
        setError("");

        const data = await getMyGroups();
        setGroups(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not load your groups"
        );
      } finally {
        setLoading(false);
      }
    }

    void loadMyGroups();
  }, []);

  return (
    <section className="panel group-management">
      <div className="section-heading">
        <div>
          <h2>My Groups</h2>
          <p>View the groups you have been added to.</p>
        </div>
      </div>

      {loading ? (
        <p>Loading your groups...</p>
      ) : error ? (
        <div className="error">{error}</div>
      ) : groups.length === 0 ? (
        <p>You have not been added to any groups yet.</p>
      ) : (
        <div className="group-list">
          {groups.map((group) => (
            <article className="group-select" key={group.id}>
              <strong>{group.name}</strong>
              <span>{group.description || "No description available."}</span>

              <button
                type="button"
                onClick={() =>
                  setSelectedGroupId(
                    selectedGroupId === group.id ? null : group.id
                  )
                }
              >
                {selectedGroupId === group.id ? "Hide Details" : "View Details"}
              </button>

              {selectedGroupId === group.id && (
                <div className="group-details">
                  <h3>Group Details</h3>

                  <p>
                    <strong>Description:</strong>{" "}
                    {group.description || "No description available."}
                  </p>

                  <div>
                    <strong>Assigned Permissions:</strong>

                    {group.permissions.length > 0 ? (
                      <ul>
                        {group.permissions.map((permission) => (
                          <li key={permission}>{permission}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No permissions assigned to this group.</p>
                    )}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default StudentGroups;
