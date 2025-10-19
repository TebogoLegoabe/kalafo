import axios, { type AxiosInstance, type AxiosError } from 'axios'

const TOKEN_STORAGE_KEY = 'token'
const LEGACY_KEYS = ['kalafo_token']

export type Role = 'admin' | 'doctor' | 'patient'

export interface User {
  id: string | number
  email: string
  role: Role
  first_name: string
  last_name: string
  created_at?: string
  is_active?: boolean
}

export interface AuthResponse {
  access_token?: string
  token?: string
  user: User
}

export interface RegisterResponse {
  user: User
  token?: string
  access_token?: string
}

export interface HealthResponse {
  status: string
  ts?: string
}

export interface Consultation {
  id: string | number
  patient_id?: string | number
  doctor_id?: string | number
  scheduled_at?: string
  started_at?: string
  ended_at?: string
  status?: 'upcoming' | 'active' | 'completed' | 'cancelled' | 'scheduled'
  notes?: string
  diagnosis?: string
}

export interface DoctorProfile {
  id: string | number
  user: User
  specialty?: string
  bio?: string
}

export interface PatientProfile {
  id: string | number
  user: User
  age?: number
  sex?: 'male' | 'female' | 'other'
}

export interface MedicalRecord {
  id: string | number
  title: string
  created_at: string
  summary?: string
}

export interface AdminDashboardResponse {
  stats: {
    total_doctors: number
    total_patients: number
    total_consultations: number
    active_consultations: number
  }
  recent_consultations: Consultation[]
}

export interface DoctorDashboardResponse {
  upcoming_consultations: Consultation[]
  recent_consultations: Consultation[]
  doctor_info: DoctorProfile
}

export interface PatientDashboardResponse {
  upcoming_consultations: Consultation[]
  past_consultations: Consultation[]
  patient_info: PatientProfile
}

export interface RegisterPayload {
  email: string
  password: string
  role: Role
  first_name: string
  last_name: string
}

export interface LoginPayload {
  email: string
  password: string
}

// Base URL from env; ensure it ends with "/api"
const rawBase =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) ||
  (typeof process !== 'undefined' && (process as any).env?.VITE_API_URL) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_BASE_URL) ||
  'http://localhost:5000/api'

function ensureApiSuffix(url: string) {
  const u = String(url).replace(/\/+$/, '')
  return u.endsWith('/api') ? u : `${u}/api`
}
const BASE_URL = ensureApiSuffix(rawBase)

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token helpers with safe storage access
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const direct = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (direct) return direct
    for (const k of LEGACY_KEYS) {
      const v = localStorage.getItem(k)
      if (v) return v
    }
    return null
  } catch (error) {
    console.warn('Failed to access localStorage:', error)
    return null
  }
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
    // Optional: clean legacy keys
    for (const k of LEGACY_KEYS) localStorage.removeItem(k)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } catch (error) {
    console.warn('Failed to set token in localStorage:', error)
  }
}

export function clearAuthToken(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    for (const k of LEGACY_KEYS) localStorage.removeItem(k)
    delete api.defaults.headers.common['Authorization']
  } catch (error) {
    console.warn('Failed to clear token from localStorage:', error)
  }
}

// Role-based routing helper
export function getDashboardRoute(role: Role): string {
  const routes: Record<Role, string> = {
    admin: '/dashboard/admin',
    doctor: '/dashboard/doctor',
    patient: '/dashboard',
  }
  return routes[role]
}

// Attach token on each request
api.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// Clear token on 401 and attach friendly messages
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<any>) => {
    if (error.response?.status === 401) {
      clearAuthToken()
    }
    error.message = getApiErrorMessage(error)
    return Promise.reject(error)
  }
)

// Authentication APIs
export async function login(
  body: LoginPayload, 
  opts?: { signal?: AbortSignal }
): Promise<AuthResponse> {
  // NOTE: paths don’t include "/api" because BASE_URL already points to ".../api"
  const response = await api.post<AuthResponse>('/login', body, { signal: opts?.signal })
  const token = response.data?.access_token || response.data?.token
  if (token) {
    setAuthToken(token)
  }
  return response.data
}

export async function register(
  body: RegisterPayload, 
  opts?: { signal?: AbortSignal }
): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>('/register', body, { signal: opts?.signal })
  const token = (response.data as any)?.access_token || (response.data as any)?.token
  if (token) {
    setAuthToken(token)
  }
  return response.data
}

export async function logout(): Promise<void> {
  clearAuthToken()
}

// Me
export async function getMe(opts?: { signal?: AbortSignal }): Promise<User> {
  const response = await api.get<User>('/me', { signal: opts?.signal })
  return response.data
}

// Health check
export async function healthCheck(
  opts?: { signal?: AbortSignal }
): Promise<HealthResponse> {
  const response = await api.get<HealthResponse>('/health', { signal: opts?.signal })
  return response.data
}

// Dashboards (protected)
export async function getAdminDashboard(
  opts?: { signal?: AbortSignal }
): Promise<AdminDashboardResponse> {
  const response = await api.get<AdminDashboardResponse>('/dashboard/admin', { signal: opts?.signal })
  return response.data
}

export async function getDoctorDashboard(
  opts?: { signal?: AbortSignal }
): Promise<DoctorDashboardResponse> {
  const response = await api.get<DoctorDashboardResponse>('/dashboard/doctor', { signal: opts?.signal })
  return response.data
}

export async function getPatientDashboard(
  opts?: { signal?: AbortSignal }
): Promise<PatientDashboardResponse> {
  const response = await api.get<PatientDashboardResponse>('/dashboard/patient', { signal: opts?.signal })
  return response.data
}

// User Management (protected)
export async function getAllUsers(
  opts?: { signal?: AbortSignal }
): Promise<{ users: User[] }> {
  const response = await api.get<{ users: User[] }>('/users', { signal: opts?.signal })
  return response.data
}

export interface PatientSummary extends User {
  consultation_count?: number
  last_consultation?: string | null
}

// Backend returns { patients: PatientSummary[], total_count: number }
export async function getAllPatients(
  opts?: { signal?: AbortSignal }
): Promise<PatientSummary[]> {
  const response = await api.get<{ patients: PatientSummary[]; total_count: number }>('/patients', { 
    signal: opts?.signal 
  })
  return response.data.patients
}

// Helper to humanize field names from the API for error messages
function humanizeFieldName(s: string): string {
  return s
    .replace(/[_\-]+/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase())
}

// Normalized error extractor used across the app
export function getApiErrorMessage(err: unknown): string {
  const e = err as AxiosError<any>
  if (!e) return 'Request failed'

  // Network / timeout / CORS
  if (e.code === 'ECONNABORTED') return 'Request timed out. Please try again.'
  if (e.message === 'Network Error' && !e.response) {
    return 'Network error. Please check your connection.'
  }

  const data = e.response?.data
  if (!data) return e.message || 'Request failed'

  if (typeof data === 'string') return data

  // Common keys
  const direct = data.message || data.error || data.detail || data.title
  if (typeof direct === 'string' && direct.trim()) return direct

  // Array of errors
  if (Array.isArray(data.errors)) {
    const msgs = data.errors
      .map((x: any) =>
        typeof x === 'string'
          ? x
          : x?.message || x?.detail || JSON.stringify(x)
      )
      .filter(Boolean)
    if (msgs.length) return msgs.join(', ')
  }

  // Field errors dictionary
  if (data.errors && typeof data.errors === 'object') {
    const parts: string[] = []
    for (const [field, msgs] of Object.entries<any>(data.errors)) {
      if (!msgs) continue
      if (Array.isArray(msgs)) {
        parts.push(`${humanizeFieldName(field)}: ${msgs.join(', ')}`)
      } else if (typeof msgs === 'string') {
        parts.push(`${humanizeFieldName(field)}: ${msgs}`)
      } else if (msgs?.message) {
        parts.push(`${humanizeFieldName(field)}: ${msgs.message}`)
      }
    }
    if (parts.length) return parts.join(' | ')
  }

  // Django/DRF style
  if (Array.isArray(data?.non_field_errors)) {
    return data.non_field_errors.join(', ')
  }

  return e.message || 'Request failed'
}

// Initialize Authorization header from stored token (if any)
const existingToken = getAuthToken()
if (existingToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${existingToken}`
}