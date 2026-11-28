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
  const [showPassword, setShowPassword] = useState(false);
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
           <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                minLength={8}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                  {!showPassword && <path d="m3 3 18 18" />}
                </svg>
              </button>
            </div>
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
