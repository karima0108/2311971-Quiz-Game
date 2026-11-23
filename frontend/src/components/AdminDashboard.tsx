import { useCallback, useEffect, useState } from "react";
import {
  getAdminDashboardStats,
  type AdminDashboardStats,
} from "../services/api";

function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAdminDashboardStats();
      setStats(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load dashboard statistics.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  const cards = [
    { label: "Total Users", value: stats?.total_users },
    { label: "Active Users", value: stats?.active_users },
    { label: "Total Admins", value: stats?.total_admins },
    { label: "Total Quizzes", value: stats?.total_quizzes },
    { label: "Published Quizzes", value: stats?.published_quizzes },
  ];

  return (
    <section className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div>
          <h2>Admin Dashboard</h2>
          <p>Overview of users and quizzes.</p>
        </div>

        <button
          type="button"
          className="secondary"
          onClick={() => void loadStats()}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh Stats"}
        </button>
      </div>

      {loading && <p>Loading dashboard statistics...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && !error && stats && (
        <div className="admin-stats-grid">
          {cards.map((card) => (
            <article className="admin-stat-card" key={card.label}>
              <h3>{card.label}</h3>
              <p>{card.value}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminDashboard;
