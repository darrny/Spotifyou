import React, { useState, useEffect } from 'react';
import { getTopTracks } from '../utils/spotifyApi';
import { motion } from 'framer-motion';

function TopSongs() {
  const [tracks, setTracks] = useState([]);
  const [timeRange, setTimeRange] = useState('short_term');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopTracks();
  }, [timeRange]);

  const fetchTopTracks = async () => {
    try {
      const data = await getTopTracks(timeRange);
      setTracks(data);
    } catch (error) {
      console.error('Error fetching top tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeRangeButtons = [
    { id: 'short_term', label: 'This Month' },
    { id: 'medium_term', label: 'Last 6 Months' },
    { id: 'long_term', label: 'All Time' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Your Top Songs</h1>
      
      {/* Time Range Filters */}
      <div className="flex gap-2 mb-8">
        {timeRangeButtons.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTimeRange(id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              timeRange === id 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 gap-4">
        {tracks.map((track) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            className="bg-gray-800/50 rounded-lg overflow-hidden"
          >
            <div className="flex items-center h-24">
              <img
                src={track.album.images[0]?.url}
                alt={track.album.name}
                className="w-24 h-24 object-cover flex-shrink-0"
              />
              <div className="flex flex-col justify-center p-4 flex-grow min-w-0">
                <h2 className="text-lg font-semibold truncate">{track.name}</h2>
                <p className="text-gray-400 truncate">{track.artists.map(artist => artist.name).join(', ')}</p>
                <p className="text-gray-500 text-sm truncate">{track.album.name}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default TopSongs;