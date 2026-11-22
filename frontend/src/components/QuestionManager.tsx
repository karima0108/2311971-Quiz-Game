import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { Quiz, Question } from "../types/quiz";

interface QuestionManagerProps {
  selectedQuiz: Quiz;
  questions: Question[];
  questionText: string;
  options: string[];
  correctOption: number;
  editingQuestionId: number | null;
  saving: boolean;
  setQuestionText: (value: string) => void;
  setOptions: Dispatch<SetStateAction<string[]>>;
  setCorrectOption: (value: number) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onClose: () => void;
  onEdit: (question: Question) => void;
  onDelete: (id: number) => void;
}

export default function QuestionManager({
  selectedQuiz,
  questions,
  questionText,
  options,
  correctOption,
  editingQuestionId,
  saving,
  setQuestionText,
  setOptions,
  setCorrectOption,
  onSubmit,
  onCancel,
  onClose,
  onEdit,
  onDelete,
}: QuestionManagerProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <h2>{selectedQuiz.title}</h2>
          <p>Manage questions for this quiz.</p>
        </div>

        <button
          type="button"
          className="secondary"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      <form onSubmit={onSubmit} className="form">
        <h3>
          {editingQuestionId !== null ? "Edit Question" : "Add Question"}
        </h3>

        <label>
          Question
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Enter your question"
            required
          />
        </label>

        {options.map((option, index) => (
          <label key={index}>
            Option {index + 1}
            <input
              value={option}
              onChange={(e) =>
                setOptions((current) =>
                  current.map((item, i) =>
                    i === index ? e.target.value : item
                  )
                )
              }
              placeholder={`Enter option ${index + 1}`}
              required
            />
          </label>
        ))}

        <label>
          Correct answer
          <select
            value={correctOption}
            onChange={(e) => setCorrectOption(Number(e.target.value))}
          >
            {options.map((option, index) => (
              <option value={index} key={index}>
                Option {index + 1}: {option || "(empty)"}
              </option>
            ))}
          </select>
        </label>

        <div className="actions">
          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : editingQuestionId !== null
                ? "Update Question"
                : "Add Question"}
          </button>

          {editingQuestionId !== null && (
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

      <h3>Questions ({questions.length})</h3>

      {questions.map((question, index) => (
        <article className="question-card" key={question.id}>
          <strong>
            {index + 1}. {question.question_text}
          </strong>

          <ol type="A">
            {question.options.map((option, i) => (
              <li key={i}>
                {option}
                {i === question.correct_option && (
                  <strong> � Correct answer</strong>
                )}
              </li>
            ))}
          </ol>

          <div className="actions">
            <button
              type="button"
              className="secondary"
              onClick={() => onEdit(question)}
            >
              Edit
            </button>

            <button
              type="button"
              className="danger"
              onClick={() => onDelete(question.id)}
            >
              Delete
            </button>
          </div>
        </article>
      ))}

      {questions.length === 0 && <p>No questions added yet.</p>}
    </section>
  );
}
