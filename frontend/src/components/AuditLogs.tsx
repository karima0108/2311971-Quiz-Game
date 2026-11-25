import { useEffect, useState } from "react"
import {
  getAuditLogs,
  getAuditLogDetails,
} from "../services/api"
import type {
  AuditLog,
  AuditLogParams,
} from "../types/auditLog"

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const [actorId, setActorId] = useState("")
  const [action, setAction] = useState("")
  const [targetType, setTargetType] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [loading, setLoading] = useState(true)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [error, setError] = useState("")

  const pageSize = 10

  async function loadLogs(
    currentPage = page,
    filters: AuditLogParams = {},
  ) {
    try {
      setLoading(true)
      setError("")

      const data = await getAuditLogs({
        ...filters,
        page: currentPage,
        page_size: pageSize,
      })

      setLogs(data.items)
      setTotal(data.total)
      setTotalPages(data.total_pages)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load audit logs.",
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadLogs(1)
  }, [])

  function currentFilters(): AuditLogParams {
    return {
      actor_id: actorId.trim() ? Number(actorId) : undefined,
      action: action || undefined,
      target_type: targetType || undefined,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    }
  }

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (actorId.trim() && (!Number.isInteger(Number(actorId)) || Number(actorId) < 1)) {
      setError("Actor ID must be a positive number.")
      return
    }

    if (startDate && endDate && startDate > endDate) {
      setError("Start date cannot be later than end date.")
      return
    }

    setPage(1)
    setSelectedLog(null)
    void loadLogs(1, currentFilters())
  }

  function handleClear() {
    setActorId("")
    setAction("")
    setTargetType("")
    setStartDate("")
    setEndDate("")
    setPage(1)
    setSelectedLog(null)
    void loadLogs(1, {})
  }

  async function handlePageChange(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages) return

    setPage(nextPage)
    setSelectedLog(null)
    await loadLogs(nextPage, currentFilters())
  }

  async function handleViewDetails(log: AuditLog) {
    if (selectedLog?.id === log.id) {
      setSelectedLog(null)
      return
    }

    try {
      setDetailsLoading(true)
      setError("")
      const data = await getAuditLogDetails(log.id)
      setSelectedLog(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load log details.",
      )
    } finally {
      setDetailsLoading(false)
    }
  }

  return (
    <section className="panel audit-logs">
      <div className="section-heading">
        <div>
          <h2>Audit Logs</h2>
          <p>Monitor account, authentication and quiz activities.</p>
        </div>

        <button
          type="button"
          className="secondary"
          onClick={() => void loadLogs(page, currentFilters())}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <form className="form" onSubmit={handleSearch}>
        <div className="audit-filter-grid">
          <label>
            Actor ID
            <input
              type="number"
              min="1"
              value={actorId}
              onChange={(event) => setActorId(event.target.value)}
              placeholder="Enter user ID"
            />
          </label>

          <label>
            Action
            <select value={action} onChange={(event) => setAction(event.target.value)}>
              <option value="">All Actions</option>
              <option value="auth.login_success">Login Success</option>
              <option value="auth.login_failed">Login Failed</option>
              <option value="auth.logout">Logout</option>
              <option value="user.activated">User Activated</option>
              <option value="user.deactivated">User Deactivated</option>
              <option value="user.role_changed">Role Changed</option>
              <option value="user.banned">User Banned</option>
              <option value="user.unbanned">User Unbanned</option>
              <option value="quiz.created">Quiz Created</option>
              <option value="quiz.updated">Quiz Updated</option>
              <option value="quiz.deleted">Quiz Deleted</option>
              <option value="quiz.published">Quiz Published</option>
              <option value="quiz.unpublished">Quiz Unpublished</option>
            </select>
          </label>

          <label>
            Target Type
            <select value={targetType} onChange={(event) => setTargetType(event.target.value)}>
              <option value="">All Targets</option>
              <option value="user">User</option>
              <option value="quiz">Quiz</option>
            </select>
          </label>

          <label>
            Start Date
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </label>

          <label>
            End Date
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </label>
        </div>

        <div className="audit-filter-actions">
          <button type="submit" disabled={loading}>Apply Filters</button>
          <button type="button" className="secondary" onClick={handleClear} disabled={loading}>
            Clear Filters
          </button>
        </div>
      </form>

      <div className="admin-list-section">
        <div className="section-heading">
          <div>
            <h3>Activity History ({total})</h3>
            <p>Page {page} of {Math.max(totalPages, 1)}</p>
          </div>
        </div>

        {loading ? (
          <p>Loading audit logs...</p>
        ) : logs.length === 0 ? (
          <p>No audit logs found.</p>
        ) : (
          <div className="admin-list">
            {logs.map((log) => (
              <article className="admin-card" key={log.id}>
                <div className="audit-log-header">
                  <strong>{log.action}</strong>
                  <span>#{log.id}</span>
                </div>

                <p><strong>Actor:</strong> {log.actor_name || "Unknown"} ({log.actor_email || "Unavailable"})</p>
                <p><strong>Actor ID:</strong> {log.actor_id ?? "System / Unknown"}</p>
                <p><strong>Target:</strong> {log.target_type || "N/A"} {log.target_id ? `#${log.target_id}` : ""}</p>
                <p><strong>Description:</strong> {log.description}</p>
                <p><strong>Time:</strong> {new Date(log.created_at).toLocaleString()}</p>

                <button
                  type="button"
                  className="secondary"
                  onClick={() => void handleViewDetails(log)}
                  disabled={detailsLoading}
                >
                  {selectedLog?.id === log.id ? "Hide Details" : "View Details"}
                </button>

                {selectedLog?.id === log.id && (
                  <div className="audit-log-details">
                    <h4>Log Details</h4>
                    <p>Log ID: {selectedLog.id}</p>
                    <p>Action: {selectedLog.action}</p>
                    <p>IP Address: {selectedLog.ip_address || "Not recorded"}</p>
                    <p>Timestamp: {new Date(selectedLog.created_at).toLocaleString()}</p>
                    <p>Description: {selectedLog.description}</p>
                    <h4>Additional Information</h4>
                    <pre>{JSON.stringify(selectedLog.details, null, 2) || "No additional details"}</pre>
                  </div>
                )}
              </article>
            ))}
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

            <span>Page {page} of {totalPages}</span>

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
