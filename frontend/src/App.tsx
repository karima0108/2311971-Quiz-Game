import { useEffect, useState, type FormEvent } from "react";
import "./index.css";

type Quiz = {
  id: number;
  title: string;
  description: string | null;
  created_at: string;
};

type Question = {
  id: number;
  question_text: string;
  options: string[];
  correct_option: number;
};

const API = "/api";

function App() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [editingQuizId, setEditingQuizId] = useState<number | null>(null);

  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState(0);
  const [editingQuestionId, setEditingQuestionId] =
    useState<number | null>(null);

  async function request<T>(
    path: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      const detail = data?.detail;

      const errorMessage = Array.isArray(detail)
        ? detail.map((item: { msg?: string }) => item.msg).join(", ")
        : detail || `Request failed: ${response.status}`;

      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  function clearMessages() {
    setMessage("");
    setError("");
  }

  async function loadQuizzes() {
    setLoading(true);
    setError("");

    try {
      const data = await request<Quiz[]>("/quizzes");
      setQuizzes(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load quizzes"
      );
    } finally {
      setLoading(false);
    }
  }

  async function openQuiz(quiz: Quiz) {
    setSelectedQuiz(quiz);
    setEditingQuestionId(null);
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectOption(0);
    clearMessages();

    try {
      const data = await request<Quiz & { questions: Question[] }>(
        `/quizzes/${quiz.id}/management`
      );

      setQuestions(data.questions);
      setSelectedQuiz(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load questions"
      );
    }
  }

  useEffect(() => {
    loadQuizzes();
  }, []);

  async function saveQuiz(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearMessages();

    const title = quizTitle.trim();

    if (!title) {
      setError("Please enter a quiz title.");
      return;
    }

    const body = {
      title,
      description: quizDescription.trim() || null,
    };

    setSaving(true);

    try {
      if (editingQuizId !== null) {
        await request(`/quizzes/${editingQuizId}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        });

        setMessage("Quiz updated successfully!");
      } else {
        await request("/quizzes", {
          method: "POST",
          body: JSON.stringify(body),
        });

        setMessage("Quiz created successfully!");
      }

      setQuizTitle("");
      setQuizDescription("");
      setEditingQuizId(null);

      await loadQuizzes();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save quiz"
      );
    } finally {
      setSaving(false);
    }
  }

  function startQuizEdit(quiz: Quiz) {
    setEditingQuizId(quiz.id);
    setQuizTitle(quiz.title);
    setQuizDescription(quiz.description || "");
    setSelectedQuiz(null);
    setQuestions([]);
    clearMessages();

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelQuizEdit() {
    setEditingQuizId(null);
    setQuizTitle("");
    setQuizDescription("");
    clearMessages();
  }

  async function deleteQuiz(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this quiz and all its questions?"
    );

    if (!confirmed) return;

    clearMessages();

    try {
      await request(`/quizzes/${id}`, { method: "DELETE" });

      setMessage("Quiz deleted successfully!");

      if (selectedQuiz?.id === id) {
        setSelectedQuiz(null);
        setQuestions([]);
      }

      if (editingQuizId === id) {
        cancelQuizEdit();
      }

      await loadQuizzes();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete quiz"
      );
    }
  }

  async function saveQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedQuiz) return;

    clearMessages();

    const body = {
      question_text: questionText.trim(),
      options: options.map((option) => option.trim()),
      correct_option: correctOption,
    };

    if (!body.question_text) {
      setError("Please enter a question.");
      return;
    }

    if (body.options.some((option) => !option)) {
      setError("Please fill in all four options.");
      return;
    }

    setSaving(true);

    try {
      if (editingQuestionId !== null) {
        await request(`/questions/${editingQuestionId}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        });

        setMessage("Question updated successfully!");
      } else {
        await request(`/quizzes/${selectedQuiz.id}/questions`, {
          method: "POST",
          body: JSON.stringify(body),
        });

        setMessage("Question added successfully!");
      }

      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectOption(0);
      setEditingQuestionId(null);

      await openQuiz(selectedQuiz);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save question"
      );
    } finally {
      setSaving(false);
    }
  }

  function startQuestionEdit(question: Question) {
    setEditingQuestionId(question.id);
    setQuestionText(question.question_text);
    setOptions([...question.options]);
    setCorrectOption(question.correct_option);
    clearMessages();
  }

  async function deleteQuestion(id: number) {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }

    clearMessages();

    try {
      await request(`/questions/${id}`, { method: "DELETE" });

      setMessage("Question deleted successfully!");

      if (selectedQuiz) {
        await openQuiz(selectedQuiz);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete question"
      );
    }
  }

  function cancelQuestionEdit() {
    setEditingQuestionId(null);
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectOption(0);
  }

  return (
    <main className="app">
      <header className="topbar">
        <div>
          <h1>Quiz Game</h1>
          <p>Admin Quiz and Question Management</p>
        </div>

        <button
          className="secondary"
          type="button"
          onClick={loadQuizzes}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}

      <section className="panel">
        <h2>{editingQuizId !== null ? "Edit Quiz" : "Create a Quiz"}</h2>

        <form onSubmit={saveQuiz} className="form">
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
                onClick={cancelQuizEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>All Quizzes</h2>
          <span>{quizzes.length} quizzes</span>
        </div>

        {loading && <p>Loading quizzes...</p>}

        {!loading && quizzes.length === 0 && (
          <p>No quizzes yet. Create your first quiz above.</p>
        )}

        <div className="quiz-grid">
          {quizzes.map((quiz) => (
            <article className="quiz-card" key={quiz.id}>
              <h3>{quiz.title}</h3>

              <p>{quiz.description || "No description available."}</p>

              <div className="actions">
                <button type="button" onClick={() => openQuiz(quiz)}>
                  Manage Questions
                </button>

                <button
                  type="button"
                  className="secondary"
                  onClick={() => startQuizEdit(quiz)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="danger"
                  onClick={() => deleteQuiz(quiz.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {selectedQuiz && (
        <section className="panel">
          <div className="section-heading">
            <div>
              <h2>{selectedQuiz.title}</h2>
              <p>Manage questions for this quiz.</p>
            </div>

            <button
              type="button"
              className="secondary"
              onClick={() => {
                setSelectedQuiz(null);
                setQuestions([]);
                cancelQuestionEdit();
                clearMessages();
              }}
            >
              Close
            </button>
          </div>

          <form onSubmit={saveQuestion} className="form">
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
                  onClick={cancelQuestionEdit}
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
                      <strong> — Correct answer</strong>
                    )}
                  </li>
                ))}
              </ol>

              <div className="actions">
                <button
                  type="button"
                  className="secondary"
                  onClick={() => startQuestionEdit(question)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="danger"
                  onClick={() => deleteQuestion(question.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}

          {questions.length === 0 && <p>No questions added yet.</p>}
        </section>
      )}

      <footer>Quiz Game · Admin Management MVP</footer>
    </main>
  );
}

export default App;