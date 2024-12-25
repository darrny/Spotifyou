// cacheUtils.js
import { supabase } from './auth';

const CACHE_DURATION = 3600000; // 1 hour in milliseconds

export const getCachedData = async (key) => {
  const { data, error } = await supabase
    .from('cache')
    .select('*')
    .eq('key', key)
    .single();

  if (error || !data) return null;

  // Check if cache is expired
  const now = new Date().getTime();
  if (now - new Date(data.created_at).getTime() > CACHE_DURATION) {
    // Delete expired cache
    await supabase.from('cache').delete().eq('key', key);
    return null;
  }

  return JSON.parse(data.value);
};

export const setCachedData = async (key, value) => {
  const { error } = await supabase
    .from('cache')
    .upsert({
      key,
      value: JSON.stringify(value),
      created_at: new Date().toISOString()
    }, {
      onConflict: 'key'
    });

  if (error) {
    console.error('Error caching data:', error);
  }
};

// Example usage in spotifyApi.js:
export const getTopArtists = async (timeRange = 'medium_term', limit = 50) => {
  const cacheKey = `top_artists_${timeRange}_${limit}`;
  
  // Try to get cached data first
  const cachedData = await getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await spotifyApi.get('/me/top/artists', {
      params: { time_range: timeRange, limit },
    });
    
    // Cache the response
    await setCachedData(cacheKey, response.data.items);
    
    return response.data.items;
  } catch (error) {
    console.error('Error fetching top artists:', error);
    throw error;
  }
};