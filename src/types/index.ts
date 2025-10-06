// Types de base pour l'application
// TODO: Ajouter les types une fois les modèles Prisma créés

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

// TODO: Ajouter les types des modèles Prisma ici
// export type User = ...
// export type Job = ...
// export type Company = ...
// export type Application = ...
