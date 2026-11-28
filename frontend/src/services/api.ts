
import type { Quiz, Question, StudentQuiz } from "../types/quiz"
import type { AttemptSubmission, AttemptResult } from "../types/attempt"
import type {
  AuditLog,
  AuditLogsResponse,
  AuditLogParams,
} from "../types/auditLog"

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "/api"
).replace(/\/$/, "")

let accessToken: string | null = null

export interface ApiUser {
  id: number
  email: string
  name: string | null
  role: string
  is_active: boolean
  is_banned: boolean
  ban_reason: string | null
  banned_at: string | null
  banned_by: number | null
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

// =========================
// AUTHENTICATION API
// =========================

export async function signup(
  email: string,
  password: string,
): Promise<ApiUser> {
  return apiRequest<ApiUser>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export async function demoLogin(
  role: "admin" | "user",
): Promise<AuthResponse> {
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

export async function updateMyProfile(
  name: string,
): Promise<ApiUser> {
  return apiRequest<ApiUser>("/auth/me", {
    method: "PUT",
    body: JSON.stringify({ name }),
  })
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  })
}

export async function logout(): Promise<void> {
  await apiRequest<void>("/auth/logout", {
    method: "POST",
  })

  setAccessToken(null)
}

// =========================
// QUIZ API
// =========================

export async function getQuizzes(): Promise<Quiz[]> {
  return apiRequest<Quiz[]>("/quizzes")
}

export async function getStudentQuiz(
  quizId: number,
): Promise<StudentQuiz> {
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
  data: {
    title: string
    description: string | null
    is_published: boolean
  },
): Promise<Quiz> {
  return apiRequest<Quiz>("/quizzes", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateQuiz(
  quizId: number,
  data: {
    title: string
    description: string | null
    is_published: boolean
  },
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

// =========================
// QUESTION API
// =========================

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

// =========================
// ADMIN MANAGEMENT API
// =========================

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

// =========================
// ADMIN DASHBOARD API
// =========================

export interface AdminDashboardStats {
  total_users: number
  total_students: number
  active_users: number
  total_admins: number
  banned_users: number
  total_quizzes: number
  published_quizzes: number
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  return apiRequest<AdminDashboardStats>("/admin/dashboard/stats")
}

// =========================
// ADMIN USER MANAGEMENT API
// =========================

export interface AdminUsersResponse {
  items: ApiUser[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface UserListParams {
  search?: string
  role?: "user" | "admin"
  status?: "active" | "inactive" | "banned" | "unbanned"
  page?: number
  page_size?: number
}

export async function getUsers(
  params: UserListParams = {},
): Promise<AdminUsersResponse> {
  const query = new URLSearchParams()

  if (params.search?.trim()) {
    query.set("search", params.search.trim())
  }

  if (params.role) {
    query.set("role", params.role)
  }

  if (params.status) {
    query.set("status", params.status)
  }

  query.set("page", String(params.page ?? 1))
  query.set("page_size", String(params.page_size ?? 10))

  return apiRequest<AdminUsersResponse>(
    `/admin/users?${query.toString()}`,
  )
}

export async function getUserDetails(
  userId: number,
): Promise<ApiUser> {
  return apiRequest<ApiUser>(`/admin/users/${userId}`)
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

// Ban a user with a reason.
export async function banUser(
  userId: number,
  reason: string,
): Promise<ApiUser> {
  return apiRequest<ApiUser>(`/admin/users/${userId}/ban`, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  })
}

// Unban a previously banned user.
export async function unbanUser(
  userId: number,
): Promise<ApiUser> {
  return apiRequest<ApiUser>(`/admin/users/${userId}/unban`, {
    method: "PATCH",
  })
}

export interface BulkUserActionResponse {
  success_count: number
  failed_count: number
  processed_user_ids: number[]
  skipped: {
    user_id: number
    reason: string
  }[]
}

export async function bulkBanUsers(
  userIds: number[],
  reason: string,
): Promise<BulkUserActionResponse> {
  return apiRequest<BulkUserActionResponse>("/admin/users/bulk-ban", {
    method: "POST",
    body: JSON.stringify({
      user_ids: userIds,
      reason,
    }),
  })
}

export async function bulkUnbanUsers(
  userIds: number[],
): Promise<BulkUserActionResponse> {
  return apiRequest<BulkUserActionResponse>("/admin/users/bulk-unban", {
    method: "POST",
    body: JSON.stringify({
      user_ids: userIds,
    }),
  })
}

// Change a user's role.
export async function changeUserRole(
  userId: number,
  role: "user" | "admin",
): Promise<ApiUser> {
  return apiRequest<ApiUser>(`/admin/users/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  })
}

// =========================
// STUDENT QUIZ ATTEMPT API
// =========================

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

// =========================
// ADMIN AUDIT LOG API
// =========================

export async function getAuditLogs(
  params: AuditLogParams = {},
): Promise<AuditLogsResponse> {
  const query = new URLSearchParams()

  if (params.actor_id !== undefined) {
    query.set("actor_id", String(params.actor_id))
  }

  if (params.action?.trim()) {
    query.set("action", params.action.trim())
  }

  if (params.target_type?.trim()) {
    query.set("target_type", params.target_type.trim())
  }

  if (params.start_date) {
    query.set("start_date", params.start_date)
  }

  if (params.end_date) {
    query.set("end_date", params.end_date)
  }

  query.set("page", String(params.page ?? 1))
  query.set("page_size", String(params.page_size ?? 10))

  return apiRequest<AuditLogsResponse>(
    `/admin/audit-logs?${query.toString()}`,
  )
}

export async function getAuditLogDetails(
  logId: number,
): Promise<AuditLog> {
  return apiRequest<AuditLog>(`/admin/audit-logs/${logId}`)
}


// =========================
// GROUP MANAGEMENT API
// =========================

export interface Group {
  id: number
  name: string
  description: string | null
}

export interface GroupMember {
  id: number
  name: string | null
  email: string
}

export interface StudentGroup {
  id: number
  name: string
  description: string | null
  owner_id: number
  permissions: string[]
}

export async function getGroups(): Promise<Group[]> {
  return apiRequest<Group[]>("/admin/groups")
}

export async function createGroup(data: {
  name: string
  description: string | null
}): Promise<Group> {
  return apiRequest<Group>("/admin/groups", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function deleteGroup(groupId: number): Promise<void> {
  return apiRequest<void>(`/admin/groups/${groupId}`, {
    method: "DELETE",
  })
}

export async function getGroupMembers(
  groupId: number,
): Promise<GroupMember[]> {
  return apiRequest<GroupMember[]>(
    `/admin/groups/${groupId}/members`,
  )
}

export async function addGroupMember(
  groupId: number,
  userId: number,
): Promise<{ message: string }> {
  return apiRequest(`/admin/groups/${groupId}/members`, {
    method: "POST",
    body: JSON.stringify({ user_id: userId }),
  })
}

export async function removeGroupMember(
  groupId: number,
  userId: number,
): Promise<{ message: string }> {
  return apiRequest(
    `/admin/groups/${groupId}/members/${userId}`,
    { method: "DELETE" },
  )
}

export async function getGroupPermissions(
  groupId: number,
): Promise<string[]> {
  return apiRequest<string[]>(
    `/admin/groups/${groupId}/permissions`,
  )
}

export async function assignGroupPermission(
  groupId: number,
  permission: string,
): Promise<{ message: string }> {
  return apiRequest(`/admin/groups/${groupId}/permissions`, {
    method: "POST",
    body: JSON.stringify({ permission }),
  })
}

export async function revokeGroupPermission(
  groupId: number,
  permission: string,
): Promise<{ message: string }> {
  return apiRequest(
    `/admin/groups/${groupId}/permissions/${encodeURIComponent(permission)}`,
    { method: "DELETE" },
  )
}

export async function getMyGroups(): Promise<StudentGroup[]> {
  return apiRequest<StudentGroup[]>("/groups/me")
}

// =========================
// STUDENT GROUP MANAGEMENT API
// =========================

export async function createMyGroup(data: {
  name: string
  description: string | null
}): Promise<Group> {
  return apiRequest<Group>("/groups", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateMyGroup(
  groupId: number,
  data: {
    name?: string
    description?: string | null
  },
): Promise<Group> {
  return apiRequest<Group>(`/groups/${groupId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteMyGroup(
  groupId: number,
): Promise<void> {
  return apiRequest<void>(`/groups/${groupId}`, {
    method: "DELETE",
  })
}

export async function getMyGroupMembers(
  groupId: number,
): Promise<GroupMember[]> {
  return apiRequest<GroupMember[]>(
    `/groups/${groupId}/members`,
  )
}

export async function addMyGroupMember(
  groupId: number,
  email: string,
): Promise<{ message: string }> {
  return apiRequest(`/groups/${groupId}/members`, {
    method: "POST",
    body: JSON.stringify({ email }),
  })
}

export async function removeMyGroupMember(
  groupId: number,
  userId: number,
): Promise<{ message: string }> {
  return apiRequest(
    `/groups/${groupId}/members/${userId}`,
    { method: "DELETE" },
  )
}