import { createClient } from '@supabase/supabase-js'

// In Vite, environment variables are exposed through import.meta.env instead of process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI

export const loginWithSpotify = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'spotify',
    options: {
      scopes: 'user-read-email user-top-read',
      redirectTo: REDIRECT_URI,
    },
  })

  if (error) {
    console.error('Error during Spotify login:', error)
    return null
  }

  return data
}

export const handleAuthCallback = async () => {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Error getting auth session:', error)
    return null
  }

  return data.session
}

export const logout = async () => {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error during logout:', error)
  }
}