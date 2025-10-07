import { User, Company, Job, JobApplication, Role, JobType } from '@prisma/client'

// Types de base pour l'application
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Types des modèles Prisma
export type { User, Company, Job, JobApplication, Role, JobType }

// Types avec relations
export type UserWithCompany = User & {
  company?: Company | null
}

export type JobWithCompany = Job & {
  company: Company
  creator: User
}

export type JobWithDetails = Job & {
  company: Company
  creator: User
  jobApplications: JobApplication[]
}

export type JobApplicationWithDetails = JobApplication & {
  job: JobWithCompany
  user?: User | null
}

// Types pour les formulaires
export interface CreateJobData {
  title: string
  type: JobType
  shortDescription: string
  description: string
  salary?: number
  location: string
  companyId: string
}

export interface CreateApplicationData {
  jobId: string
  message: string
  applicantName: string
  applicantEmail: string
  applicantPhone?: string
  userId?: string
}

export interface CreateCompanyData {
  compName: string
  place: string
  information?: string
  website?: string
}

export interface RegisterUserData {
  firstname: string
  lastname: string
  email: string
  phone?: string
  password: string
  role?: Role
  companyId?: string
}

export interface LoginData {
  email: string
  password: string
}
