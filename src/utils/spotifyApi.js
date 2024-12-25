import axios from 'axios'
import { supabase } from './auth'

const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1'

const getAccessToken = async () => {
  const { data, error } = await supabase.auth.getSession()

  if (error || !data.session) {
    throw new Error('No active session')
  }

  return data.session.provider_token
}

const spotifyApi = axios.create({
  baseURL: SPOTIFY_API_BASE_URL,
})

spotifyApi.interceptors.request.use(async (config) => {
  const token = await getAccessToken()
  config.headers.Authorization = `Bearer ${token}`
  return config
})

export const getTopArtists = async (timeRange = 'medium_term', limit = 50) => {
  try {
    const response = await spotifyApi.get('/me/top/artists', {
      params: { time_range: timeRange, limit },
    })
    return response.data.items
  } catch (error) {
    console.error('Error fetching top artists:', error)
    throw error
  }
}

export const getTopTracks = async (timeRange = 'medium_term', limit = 50) => {
  try {
    const response = await spotifyApi.get('/me/top/tracks', {
      params: { time_range: timeRange, limit },
    })
    return response.data.items
  } catch (error) {
    console.error('Error fetching top tracks:', error)
    throw error
  }
}

