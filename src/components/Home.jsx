import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getTopArtists, getTopTracks } from '../utils/spotifyApi';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight } from 'lucide-react';

function Home() {
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistsData, tracksData] = await Promise.all([
          getTopArtists('short_term', 10),
          getTopTracks('short_term', 10)
        ]);
        setTopArtists(artistsData);
        setTopTracks(tracksData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const Section = ({ title, linkTo, linkText, children }) => (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Link 
          to={linkTo}
          className="flex items-center text-green-500 hover:text-green-400 transition-colors"
        >
          {linkText}
          <ChevronRight className="ml-1" size={20} />
        </Link>
      </div>
      {children}
    </section>
  );

  return (
    <div className="space-y-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Spotifyou</h1>
        <p className="text-gray-400">Your personal music companion powered by AI</p>
      </div>

      <Section title="Your Top Artists" linkTo="/top-artists" linkText="See all artists">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {loading
            ? Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="w-full h-48 rounded-lg" />
              ))
            : topArtists.slice(0, 5).map((artist) => (
                <motion.div
                  key={artist.id}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="border-0 bg-gray-800/50 hover:bg-gray-800 transition-colors overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-square">
                        <img
                          src={artist.images[0]?.url}
                          alt={artist.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold truncate">{artist.name}</h3>
                        <p className="text-sm text-gray-400">Artist</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>
      </Section>

      <Section title="Your Top Tracks" linkTo="/top-songs" linkText="See all tracks">
        <div className="grid gap-4">
          {loading
            ? Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="w-full h-16 rounded-lg" />
              ))
            : topTracks.slice(0, 5).map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-0 bg-gray-800/50 hover:bg-gray-800 transition-colors">
                    <CardContent className="flex items-center p-4">
                      <div className="w-12 h-12 mr-4">
                        <img
                          src={track.album.images[0]?.url}
                          alt={track.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="font-semibold truncate">{track.name}</h3>
                        <p className="text-sm text-gray-400 truncate">
                          {track.artists.map(a => a.name).join(', ')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>
      </Section>

      <Section title="AI Recommendations" linkTo="/ai-recommendations" linkText="Try it now">
        <Card className="border-0 bg-gradient-to-r from-purple-900/50 to-blue-900/50 hover:from-purple-900 hover:to-blue-900 transition-colors">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">
              Get Personalized Recommendations
            </h3>
            <p className="text-gray-400">
              Use our AI-powered feature to discover new music based on your taste
              and preferences.
            </p>
          </CardContent>
        </Card>
      </Section>
    </div>
  );
}

export default Home;