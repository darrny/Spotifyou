import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTopTracks } from '../utils/spotifyApi';
import { getAIRecommendations, getAIPlaylistSuggestions } from '../utils/aiUtils';

function AIRecommendations() {
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [topSongs, setTopSongs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [playlistPrompt, setPlaylistPrompt] = useState('');
  const [playlistSuggestions, setPlaylistSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTopSongs = async () => {
    try {
      const data = await getTopTracks('short_term', 20);
      setTopSongs(data);
    } catch (error) {
      console.error('Error fetching top songs:', error);
      setError('Failed to fetch your top songs');
    }
  };

  const handleSongSelection = (song) => {
    if (selectedSongs.length < 5 && !selectedSongs.some(s => s.id === song.id)) {
      setSelectedSongs([...selectedSongs, song]);
    }
  };

  const handleRemoveSong = (song) => {
    setSelectedSongs(selectedSongs.filter(s => s.id !== song.id));
  };

  const handleGetRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const songPrompt = selectedSongs
        .map(song => `${song.name} by ${song.artists[0].name}`)
        .join(', ');
      const recs = await getAIRecommendations(selectedSongs, 
        `Based on these songs: ${songPrompt}, suggest similar songs that match their style and mood.`
      );
      setRecommendations(recs);
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      setError('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetPlaylistSuggestions = async () => {
    if (!playlistPrompt.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const suggestions = await getAIPlaylistSuggestions(playlistPrompt);
      setPlaylistSuggestions(suggestions);
    } catch (error) {
      console.error('Error getting AI playlist suggestions:', error);
      setError('Failed to get playlist suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Recommendations</h1>
      
      {error && (
        <div className="bg-red-500/20 text-red-200 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Select up to 5 songs:</h2>
        <button
          onClick={fetchTopSongs}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg mb-4"
        >
          Load Your Top Songs
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topSongs.map((song) => (
            <motion.div
              key={song.id}
              className="bg-gray-800/50 rounded-lg overflow-hidden flex cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => handleSongSelection(song)}
            >
              <img
                src={song.album.images[0]?.url}
                alt={song.name}
                className="w-16 h-16 object-cover"
              />
              <div className="p-3 flex-grow">
                <h3 className="font-semibold truncate">{song.name}</h3>
                <p className="text-sm text-gray-400 truncate">
                  {song.artists.map((artist) => artist.name).join(', ')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedSongs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Selected Songs:</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedSongs.map((song) => (
              <div
                key={song.id}
                className="bg-gray-800/50 rounded-full px-4 py-2 flex items-center"
              >
                <span className="text-sm mr-2">{song.name}</span>
                <button
                  onClick={() => handleRemoveSong(song)}
                  className="text-gray-400 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleGetRecommendations}
            disabled={loading || selectedSongs.length === 0}
            className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Getting Recommendations...' : 'Get AI Recommendations'}
          </button>
        </div>
      )}

{recommendations.length > 0 && (
  <div className="mb-12">
    <h2 className="text-2xl font-semibold mb-4">AI Recommendations</h2>
    <div className="space-y-2">
      {recommendations.map((rec, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-800/50 rounded-lg p-4 flex items-center gap-4 group hover:bg-gray-800 transition-colors"
        >
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-green-600/20 rounded-full text-green-500 font-medium">
            {index + 1}
          </div>
          <div className="flex-grow min-w-0">
            <h3 className="font-semibold text-lg truncate group-hover:text-green-400 transition-colors">
              {rec.songName}
            </h3>
            <p className="text-gray-400 truncate">
              {rec.artistName}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
)}

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Get AI Playlist Suggestions</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={playlistPrompt}
            onChange={(e) => setPlaylistPrompt(e.target.value)}
            placeholder="Enter a theme or mood for your playlist (e.g., 'Chill study music' or 'High energy workout')"
            className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-green-500 focus:outline-none"
          />
          <button
            onClick={handleGetPlaylistSuggestions}
            disabled={loading || !playlistPrompt.trim()}
            className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Getting Suggestions...' : 'Get AI Playlist Suggestions'}
          </button>
        </div>

        {playlistSuggestions.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Suggested Playlist:</h3>
            <div className="space-y-2">
              {playlistSuggestions.map((suggestion, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold">{suggestion.songName}</h4>
                  <p className="text-gray-400">{suggestion.artistName}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIRecommendations;