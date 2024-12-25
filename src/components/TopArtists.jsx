import React, { useState, useEffect } from 'react';
import { getTopArtists } from '../utils/spotifyApi';
import { motion } from 'framer-motion';

function TopArtists() {
  const [artists, setArtists] = useState([]);
  const [timeRange, setTimeRange] = useState('short_term');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopArtists();
  }, [timeRange]);

  const fetchTopArtists = async () => {
    try {
      const data = await getTopArtists(timeRange);
      setArtists(data);
    } catch (error) {
      console.error('Error fetching top artists:', error);
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
      <h1 className="text-4xl font-bold mb-8">Your Top Artists</h1>
      
      {/* Time Range Filters */}
      <div className="flex gap-2 mb-8">
        {timeRangeButtons.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTimeRange(id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              timeRange === id 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-800 hover:bg-green-600/20 hover:text-green-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {artists.map((artist) => (
          <motion.div
            key={artist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800/50 rounded-lg overflow-hidden"
          >
            <div className="aspect-square w-full relative">
              <img
                src={artist.images[0]?.url}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold truncate">{artist.name}</h2>
              <p className="text-gray-400 text-sm truncate">
                {artist.genres.slice(0, 3).join(', ')}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default TopArtists;