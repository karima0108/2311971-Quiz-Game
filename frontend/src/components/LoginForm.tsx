import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";

interface LoginFormProps {
  onSuccess: () => void;
}

function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, signup, demoLogin } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (mode === "signup") {
        await signup(email.trim(), password);
        setMessage("Account created successfully! Please log in.");
        setMode("login");
        setPassword("");
      } else {
        await login(email.trim(), password);
        onSuccess();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Authentication failed."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin(role: "admin" | "user") {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await demoLogin(role);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Demo login failed."
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <section className="panel">
      <h2>{mode === "login" ? "Login" : "Create Account"}</h2>

      <p>
        {mode === "login"
          ? "Log in to manage quizzes and questions."
          : "Create an account to get started."}
      </p>

      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            minLength={8}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : mode === "login"
              ? "Login"
              : "Create Account"}
        </button>
      </form>

      {mode === "login" && (
        <div className="demo-login-buttons">
          <p>Try the application:</p>
          <button
            type="button"
            className="secondary"
            disabled={loading}
            onClick={() => handleDemoLogin("admin")}
          >
            Demo Admin Login
          </button>
          <button
            type="button"
            className="secondary"
            disabled={loading}
            onClick={() => handleDemoLogin("user")}
          >
            Demo User Login
          </button>
        </div>
      )}

      <p>
        {mode === "login"
          ? "Don't have an account? "
          : "Already have an account? "}

        <button
          type="button"
          className="secondary"
          disabled={loading}
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError("");
            setMessage("");
          }}
        >
          {mode === "login" ? "Sign Up" : "Login"}
        </button>
      </p>
    </section>
  );
}

export default LoginForm;
