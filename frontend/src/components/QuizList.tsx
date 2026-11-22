import type { Quiz } from "../types/quiz";

interface QuizListProps {
  quizzes: Quiz[];
  loading: boolean;
  isAdmin: boolean;
  onOpen: (quiz: Quiz) => void;
  onEdit: (quiz: Quiz) => void;
  onDelete: (id: number) => void;
  onTogglePublish: (quiz: Quiz) => void;
}

export default function QuizList({
  quizzes,
  loading,
  isAdmin,
  onOpen,
  onEdit,
  onDelete,
  onTogglePublish,
}: QuizListProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <h2>All Quizzes</h2>
        <span>{quizzes.length} quizzes</span>
      </div>

      {loading && <p>Loading quizzes...</p>}

      {!loading && quizzes.length === 0 && (
        <p>{isAdmin ? "No quizzes yet. Create your first quiz above." : "No quizzes available yet."}</p>
      )}

      <div className="quiz-grid">
        {quizzes.map((quiz) => (
          <article className="quiz-card" key={quiz.id}>
            <h3>{quiz.title}</h3>

            <p>{quiz.description || "No description available."}</p>

            {!isAdmin && (
              <div className="actions">
                <button type="button" onClick={() => onOpen(quiz)}>
                  View Questions
                </button>
              </div>
            )}

            {isAdmin && (
              <>
                <p>
                  Status: <strong>{quiz.is_published ? "Published" : "Unpublished"}</strong>
                </p>

                <div className="actions">
                  <button type="button" onClick={() => onOpen(quiz)}>
                    Manage Questions
                  </button>

                  <button
                    type="button"
                    className="secondary"
                    onClick={() => onEdit(quiz)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="secondary"
                    onClick={() => onTogglePublish(quiz)}
                  >
                    {quiz.is_published ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    type="button"
                    className="danger"
                    onClick={() => onDelete(quiz.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
