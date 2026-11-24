import { useEffect, useState, type FormEvent } from "react";
import type { Quiz, Question, StudentQuestion, StudentQuiz } from "./types/quiz";
import type { AttemptResult } from "./types/attempt";
import {
  getQuizzes,
  getQuizManagement,
  getStudentQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz as deleteQuizApi,
  createQuestion,
  updateQuestion,
  deleteQuestion as deleteQuestionApi,
} from "./services/api";
import "./index.css";
import QuizForm from "./components/QuizForm";
import QuizList from "./components/QuizList";
import QuestionManager from "./components/QuestionManager";
import LoginForm from "./components/LoginForm";
import AdminManagement from "./components/AdminManagement";
import AdminDashboard from "./components/AdminDashboard";
import UserManagement from "./components/UserManagement";
import StudentProfile from "./components/StudentProfile";
import StudentQuizAttempt from "./components/StudentQuizAttempt";
import StudentAttemptHistory from "./components/StudentAttemptHistory";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activePage, setActivePage] = useState<"dashboard" | "admins" | "profile" | "admin-dashboard" | "user-management" | "attempt-history">("dashboard");
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [studentQuestions, setStudentQuestions] = useState<StudentQuestion[]>([]);
  const [selectedStudentQuiz, setSelectedStudentQuiz] = useState<StudentQuiz | null>(null);
  const [attemptResult, setAttemptResult] = useState<AttemptResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [quizIsPublished, setQuizIsPublished] = useState(true);
  const [editingQuizId, setEditingQuizId] = useState<number | null>(null);

  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState(0);
  const [editingQuestionId, setEditingQuestionId] =
    useState<number | null>(null);

  function clearMessages() {
    setMessage("");
    setError("");
  }

  async function loadQuizzes() {
    setLoading(true);
    setError("");

    try {
      const data = await getQuizzes();
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
    setAttemptResult(null);
    setSelectedQuiz(quiz);
    setEditingQuestionId(null);
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectOption(0);
    clearMessages();
    setSelectedStudentQuiz(null);

    try {
      if (user?.role === "admin") {
        const data = await getQuizManagement(quiz.id);

        setQuestions(data.questions);
        setStudentQuestions([]);
        setSelectedQuiz(data);
      } else {
        const data = await getStudentQuiz(quiz.id);

        setStudentQuestions(data.questions);
        setQuestions([]);
        setSelectedStudentQuiz(data);
        setSelectedQuiz(data);
      }
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
      is_published: quizIsPublished,
    };

    setSaving(true);

    try {
      if (editingQuizId !== null) {
        await updateQuiz(editingQuizId, body);

        setMessage("Quiz updated successfully!");
      } else {
        await createQuiz(body);

        setMessage("Quiz created successfully!");
      }

      setQuizTitle("");
      setQuizDescription("");
      setQuizIsPublished(true);
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
    setQuizIsPublished(quiz.is_published);
    setSelectedQuiz(null);
    setQuestions([]);
    clearMessages();

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelQuizEdit() {
    setEditingQuizId(null);
    setQuizTitle("");
    setQuizDescription("");
    setQuizIsPublished(true);
    clearMessages();
  }

  async function toggleQuizPublish(quiz: Quiz) {
    clearMessages();

    try {
      await updateQuiz(quiz.id, {
        title: quiz.title,
        description: quiz.description,
        is_published: !quiz.is_published,
      });

      setMessage(
        quiz.is_published
          ? "Quiz unpublished successfully!"
          : "Quiz published successfully!"
      );

      await loadQuizzes();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update quiz status"
      );
    }
  }
  async function deleteQuiz(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this quiz and all its questions?"
    );

    if (!confirmed) return;

    clearMessages();

    try {
      await deleteQuizApi(id);

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
        await updateQuestion(editingQuestionId, body);

        setMessage("Question updated successfully!");
      } else {
        await createQuestion(selectedQuiz.id, body);

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
      await deleteQuestionApi(id);

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

  if (authLoading) {
    return (
      <main className={`app ${user?.role === "admin" ? "theme-admin" : "theme-student"}`}>
        <p>Checking login session...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="app theme-welcome welcome-page">
        <section className="welcome-layout">
          <div className="welcome-content">
            <p className="welcome-intro">Welcome to</p>
            <h1 className="welcome-brand">Quizzy</h1>
            <p className="welcome-tagline">
              Learn Â· Play Â· Challenge Yourself
            </p>
            <p className="welcome-description">
              Discover fun quizzes, test your knowledge, and challenge
              yourself to learn something new every day.
            </p>
          </div>

          <div className="welcome-auth">
            <LoginForm onSuccess={loadQuizzes} />
          </div>
        </section>
        <footer>Quizzy Â· Learn something new every day</footer>
      </main>
    );
  }

  return (
    <main className={`app ${user?.role === "admin" ? "theme-admin" : "theme-student"}`}>
      <header className="topbar">
        <div>
          <h1>Quiz Game</h1>
          <p>{user?.email} Â· Role: {user?.role}</p>
        </div>

        <nav className="app-navigation">
          <button type="button" className={activePage === "profile" ? "" : "secondary"} onClick={() => setActivePage("profile")}>My Profile</button>
          {user?.role === "user" && (
            <button
              type="button"
              className={activePage === "attempt-history" ? "" : "secondary"}
              onClick={() => setActivePage("attempt-history")}
            >
              My Quiz History
            </button>
          )}
          <button
            type="button"
            className={activePage === "dashboard" ? "" : "secondary"}
            onClick={() => setActivePage("dashboard")}
          >
            Dashboard
          </button>

          {user?.role === "admin" && (
            <button
              type="button"
              className={activePage === "admin-dashboard" ? "" : "secondary"}
              onClick={() => setActivePage("admin-dashboard")}
            >
              Admin Dashboard
            </button>
          )}

          {user?.role === "admin" && (
            <button
              type="button"
              className={activePage === "admins" ? "" : "secondary"}
              onClick={() => setActivePage("admins")}
            >
              Admin Management
            </button>
          )}
        </nav>

          {user?.role === "admin" && (
            <button
              type="button"
              className={activePage === "user-management" ? "" : "secondary"}
              onClick={() => setActivePage("user-management")}
            >
              User Management
            </button>
          )}

        <button
          className="secondary"
          type="button"
          onClick={() => { void logout(); }}
        >
          Logout
        </button>
        <button
          className="secondary"
          type="button"
          onClick={loadQuizzes}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      {user?.role === "user" && attemptResult && activePage === "dashboard" ? (
        <section className="panel">
          <div className="section-heading">
            <div>
              <h2>Quiz Result</h2>
              <p>Your quiz has been submitted successfully.</p>
            </div>
          </div>

          <div className="profile-details">
            <div className="profile-detail">
              <span>Score</span>
              <strong>{attemptResult.score}/{attemptResult.total_questions}</strong>
            </div>

            <div className="profile-detail">
              <span>Correct Answers</span>
              <strong>{attemptResult.correct_answers}</strong>
            </div>

            <div className="profile-detail">
              <span>Total Questions</span>
              <strong>{attemptResult.total_questions}</strong>
            </div>

            <div className="profile-detail">
              <span>Submitted At</span>
              <strong>{new Date(attemptResult.submitted_at).toLocaleString()}</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setAttemptResult(null);
              setActivePage("dashboard");
            }}
          >
            Back to Dashboard
          </button>
        </section>
      ) : activePage === "profile" ? (
        <StudentProfile />
      ) : activePage === "attempt-history" && user?.role === "user" ? (
        <StudentAttemptHistory />
      ) : activePage === "admin-dashboard" && user?.role === "admin" ? (
        <AdminDashboard />
      ) : activePage === "admins" && user?.role === "admin" ? (
        <AdminManagement />
      ) : activePage === "user-management" && user?.role === "admin" ? (
        <UserManagement />
      ) : (
        <>
      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}

      {user?.role === "admin" && (
      <QuizForm
        quizTitle={quizTitle}
        quizDescription={quizDescription}
          quizIsPublished={quizIsPublished}
          setQuizIsPublished={setQuizIsPublished}
        editingQuizId={editingQuizId}
        saving={saving}
        setQuizTitle={setQuizTitle}
        setQuizDescription={setQuizDescription}
        onSubmit={saveQuiz}
        onCancel={cancelQuizEdit}
      />
      )}
      <QuizList
        quizzes={quizzes}
        loading={loading}
        isAdmin={user?.role === "admin"}
        onOpen={openQuiz}
        onEdit={startQuizEdit}
        onDelete={deleteQuiz}
        onTogglePublish={toggleQuizPublish}
      />

      {user?.role === "user" && selectedStudentQuiz && (
        <StudentQuizAttempt
          quiz={selectedStudentQuiz}
          onSubmitted={(result) => {
            setAttemptResult(result);
            setMessage("");
            setSelectedStudentQuiz(null);
            setSelectedQuiz(null);
            setStudentQuestions([]);
          }}
          onCancel={() => {
            setSelectedStudentQuiz(null);
            setSelectedQuiz(null);
            setStudentQuestions([]);
            clearMessages();
          }}
        />
      )}

      {user?.role === "admin" && selectedQuiz && (
        <QuestionManager
          selectedQuiz={selectedQuiz}
          questions={questions}
          questionText={questionText}
          options={options}
          correctOption={correctOption}
          editingQuestionId={editingQuestionId}
          saving={saving}
          setQuestionText={setQuestionText}
          setOptions={setOptions}
          setCorrectOption={setCorrectOption}
          onSubmit={saveQuestion}
          onCancel={cancelQuestionEdit}
          onClose={() => {
            setSelectedQuiz(null);
            setQuestions([]);
            cancelQuestionEdit();
            clearMessages();
          }}
          onEdit={startQuestionEdit}
          onDelete={deleteQuestion}
        />
      )}

        </>
      )}
      <footer>Quiz Game Â· Admin Management MVP</footer>
    </main>
  );
}

export default App;
