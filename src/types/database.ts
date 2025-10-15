export type UserRole = 'customer' | 'artist' | 'admin'

export interface SignupData {
  email: string
  password: string
  username: string
  first_name?: string
  last_name?: string
  phone?: string
  role?: UserRole
}

export interface User {
  id: string
  email: string
  username: string
  first_name?: string
  last_name?: string
  phone?: string
  avatar_url?: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  success: boolean
  data?: {
    user: User
    session: {
      access_token: string
      refresh_token: string
    }
  }
  error?: {
    code: string
    message: string
  },
  message?: string
}
