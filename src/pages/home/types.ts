export interface Feature {
  icon: string
  title: string
  description: string
}

export interface FeaturedProfile {
  first_name: string
  last_name: string
  location: string | null
  avatar_url: string | null
  projects_count: number
}

export interface GlobalStats {
  total_users: number
  total_projects: number
  total_views: number
}
