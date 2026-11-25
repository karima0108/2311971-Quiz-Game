export interface AuditLog {
  id: number
  actor_id: number | null
  actor_name: string | null
  actor_email: string | null
  action: string
  target_type: string | null
  target_id: string | null
  description: string
  details: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

export interface AuditLogsResponse {
  items: AuditLog[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface AuditLogParams {
  actor_id?: number
  action?: string
  target_type?: string
  start_date?: string
  end_date?: string
  page?: number
  page_size?: number
}
