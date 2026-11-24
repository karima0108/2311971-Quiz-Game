
import { useEffect, useState } from "react"
import { getMyAttempts } from "../services/api"
import type { AttemptResult } from "../types/attempt"

export default function StudentAttemptHistory() {
  const [attempts, setAttempts] = useState<AttemptResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadAttempts() {
      try {
        setAttempts(await getMyAttempts())
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not load attempt history.",
        )
      } finally {
        setLoading(false)
      }
    }

    loadAttempts()
  }, [])

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <h2>My Quiz History</h2>
          <p>Review your previous quiz attempts and scores.</p>
        </div>
      </div>

      {loading && <p>Loading your attempts...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && !error && attempts.length === 0 && (
        <p>You have not attempted any quizzes yet.</p>
      )}

      {!loading && !error && attempts.length > 0 && (
        <div className="profile-details">
          {attempts.map((attempt) => (
            <div className="profile-detail" key={attempt.id}>
              <span>
              <strong>{attempt.quiz_title}</strong> · Attempt #{attempt.id}
                <br />
                {new Date(attempt.submitted_at).toLocaleString()}
              </span>

              <strong>
                {attempt.score}/{attempt.total_questions}
              </strong>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
