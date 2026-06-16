import { API_BASE_URL } from '../config/env'
import { handleResponse } from '../utils/apiHelpers'

export interface FeedUser {
  id: number
  first_name: string
  last_name: string
  avatar_url?: string
  profession?: string
  portfolio_id: number
}

export interface FeedItem {
  id: number
  event: 'created' | 'updated'
  created_at: string
  user: FeedUser
}

export interface FeedResponse {
  data: FeedItem[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export const getFeed = async (page = 1, perPage = 10): Promise<FeedResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString()
  })

  const response = await fetch(`${API_BASE_URL}/feed?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })

  return handleResponse<FeedResponse>(response)
}
