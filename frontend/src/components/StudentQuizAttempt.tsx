import { useState } from "react"
import type { StudentQuiz } from "../types/quiz"
import type { AnswerSubmission, AttemptResult } from "../types/attempt"
import { submitQuizAttempt } from "../services/api"

interface StudentQuizAttemptProps {
  quiz: StudentQuiz
  onSubmitted: (result: AttemptResult) => void
  onCancel: () => void
}

export default function StudentQuizAttempt({
  quiz,
  onSubmitted,
  onCancel,
}: StudentQuizAttemptProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  function selectAnswer(questionId: number, optionIndex: number) {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: optionIndex,
    }))
  }

  async function handleSubmit() {
    if (Object.keys(answers).length !== quiz.questions.length) {
      setError("Please answer every question before submitting.")
      return
    }

    const submittedAnswers: AnswerSubmission[] = quiz.questions.map(
      (question) => ({
        question_id: question.id,
        selected_option: answers[question.id],
      }),
    )

    try {
      setSubmitting(true)
      setError("")

      const result = await submitQuizAttempt(quiz.id, {
        answers: submittedAnswers,
      })

      onSubmitted(result)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit quiz.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="student-attempt">
      <div className="student-attempt-header">
        <h2>{quiz.title}</h2>
        <p>{quiz.description}</p>
        <p>
          {Object.keys(answers).length} of {quiz.questions.length} answered
        </p>
      </div>

      {quiz.questions.map((question, questionIndex) => (
        <div className="student-attempt-question" key={question.id}>
          <h3>
            Question {questionIndex + 1}: {question.question_text}
          </h3>

          <div className="student-attempt-options">
            {question.options.map((option, optionIndex) => (
              <label
                key={optionIndex}
                className={
                  answers[question.id] === optionIndex
                    ? "student-attempt-option selected"
                    : "student-attempt-option"
                }
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={optionIndex}
                  checked={answers[question.id] === optionIndex}
                  onChange={() =>
                    selectAnswer(question.id, optionIndex)
                  }
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {error && <p className="error-message">{error}</p>}

      <div className="student-attempt-actions">
        <button type="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || quiz.questions.length === 0}
        >
          {submitting ? "Submitting..." : "Submit Quiz"}
        </button>
      </div>
    </div>
  )
}
