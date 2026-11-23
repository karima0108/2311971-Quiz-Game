import type { FormEvent } from "react";

interface QuizFormProps {
  quizTitle: string;
  quizDescription: string;
  quizIsPublished: boolean;
  editingQuizId: number | null;
  saving: boolean;
  setQuizTitle: (value: string) => void;
  setQuizDescription: (value: string) => void;
  setQuizIsPublished: (value: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

export default function QuizForm({
  quizTitle,
  quizDescription,
  quizIsPublished,
  editingQuizId,
  saving,
  setQuizTitle,
  setQuizDescription,
  setQuizIsPublished,
  onSubmit,
  onCancel,
}: QuizFormProps) {
  return (
    <section className="panel">
      <h2>{editingQuizId !== null ? "Edit Quiz" : "Create a Quiz"}</h2>

      <form onSubmit={onSubmit} className="form">
        <label>
          Quiz title
          <input
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Enter quiz title"
            required
            maxLength={200}
          />
        </label>

        <label>
          Description
          <textarea
            value={quizDescription}
            onChange={(e) => setQuizDescription(e.target.value)}
            placeholder="Enter quiz description"
          />
        </label>

        <label>
          <input
            type="checkbox"
            checked={quizIsPublished}
            onChange={(e) => setQuizIsPublished(e.target.checked)}
          />
          Publish quiz (visible to students)
        </label>

        <div className="actions">
          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : editingQuizId !== null
                ? "Update Quiz"
                : "Create Quiz"}
          </button>

          {editingQuizId !== null && (
            <button
              type="button"
              className="secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
