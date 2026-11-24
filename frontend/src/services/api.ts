import type { Quiz, Question, StudentQuiz } from "../types/quiz"
import type { AttemptSubmission, AttemptResult } from "../types/attempt"

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "/api"
).replace(/\/$/, "")

let accessToken: string | null = null

export interface ApiUser {
  id: number
  email: string
  role: string
  is_active: boolean
  created_at: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export function setAccessToken(token: string | null): void {
  accessToken = token
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers)

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json")
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  })

  if (response.status === 204) {
    return undefined as T
  }

  const responseData = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      responseData?.detail || "Something went wrong. Please try again."

    throw new ApiError(
      typeof message === "string" ? message : "Request failed",
      response.status,
    )
  }

  return responseData as T
}

// AUTHENTICATION API

export async function signup(
  email: string,
  password: string,
): Promise<ApiUser> {
  return apiRequest<ApiUser>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export async function demoLogin(role: "admin" | "user"): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>(`/auth/demo-login/${role}`, {
    method: "POST",
  })
  setAccessToken(data.access_token)
  return data
}
export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })

  setAccessToken(data.access_token)

  return data
}

export async function refreshAccessToken(): Promise<string> {
  const data = await apiRequest<AuthResponse>("/auth/refresh", {
    method: "POST",
  })

  setAccessToken(data.access_token)

  return data.access_token
}

export async function getCurrentUser(): Promise<ApiUser> {
  return apiRequest<ApiUser>("/auth/me")
}

export async function logout(): Promise<void> {
  await apiRequest<void>("/auth/logout", {
    method: "POST",
  })

  setAccessToken(null)
}

// QUIZ API

export async function getQuizzes(): Promise<Quiz[]> {
  return apiRequest<Quiz[]>("/quizzes")
}

export async function getStudentQuiz(quizId: number): Promise<StudentQuiz> {
  return apiRequest<StudentQuiz>(`/quizzes/${quizId}`)
}

export async function getQuizManagement(
  quizId: number,
): Promise<Quiz & { questions: Question[] }> {
  return apiRequest<Quiz & { questions: Question[] }>(
    `/quizzes/${quizId}/management`,
  )
}

export async function createQuiz(
  data: { title: string; description: string | null; is_published: boolean },
): Promise<Quiz> {
  return apiRequest<Quiz>("/quizzes", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateQuiz(
  quizId: number,
  data: { title: string; description: string | null; is_published: boolean },
): Promise<Quiz> {
  return apiRequest<Quiz>(`/quizzes/${quizId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteQuiz(quizId: number): Promise<void> {
  return apiRequest<void>(`/quizzes/${quizId}`, {
    method: "DELETE",
  })
}

// QUESTION API

export interface QuestionInput {
  question_text: string
  options: string[]
  correct_option: number
}

export async function createQuestion(
  quizId: number,
  data: QuestionInput,
): Promise<Question> {
  return apiRequest<Question>(`/quizzes/${quizId}/questions`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateQuestion(
  questionId: number,
  data: QuestionInput,
): Promise<Question> {
  return apiRequest<Question>(`/questions/${questionId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteQuestion(questionId: number): Promise<void> {
  return apiRequest<void>(`/questions/${questionId}`, {
    method: "DELETE",
  })
}

 // ADMIN MANAGEMENT API

export async function getAdmins(): Promise<ApiUser[]> {
  return apiRequest<ApiUser[]>("/admins")
}

export async function createAdmin(
  email: string,
  password: string,
): Promise<ApiUser> {
  return apiRequest<ApiUser>("/admins", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export async function deleteAdmin(adminId: number): Promise<void> {
  return apiRequest<void>(`/admins/${adminId}`, {
    method: "DELETE",
  })
}



// ADMIN DASHBOARD API

export interface AdminDashboardStats {
  total_users: number
  active_users: number
  total_admins: number
  total_quizzes: number
  published_quizzes: number
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  return apiRequest<AdminDashboardStats>("/admin/dashboard/stats")
}

// ADMIN USER MANAGEMENT API

export async function getUsers(search = ""): Promise<ApiUser[]> {
  const query = search.trim()
    ? `?search=${encodeURIComponent(search.trim())}`
    : ""

  return apiRequest<ApiUser[]>(`/admin/users${query}`)
}

export async function updateUserStatus(
  userId: number,
  isActive: boolean,
): Promise<ApiUser> {
  return apiRequest<ApiUser>(
    `/admin/users/${userId}/status?is_active=${isActive}`,
    {
      method: "PATCH",
    },
  )
}




// STUDENT QUIZ ATTEMPT API

export async function submitQuizAttempt(
  quizId: number,
  submission: AttemptSubmission,
): Promise<AttemptResult> {
  return apiRequest<AttemptResult>(
    `/quizzes/${quizId}/attempts`,
    {
      method: "POST",
      body: JSON.stringify(submission),
    },
  )
}

export async function getMyAttempts(): Promise<AttemptResult[]> {
  return apiRequest<AttemptResult[]>("/attempts/me")
}
