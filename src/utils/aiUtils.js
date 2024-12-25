import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const parseRecommendations = (text) => {
  try {
    // Split by newlines and filter out empty lines
    const lines = text.split('\n').filter(line => line.trim());
    
    return lines.map(line => {
      const match = line.match(/^\d+\.\s+"(.+)"\s+by\s+(.+)$/);
      if (match) {
        return {
          songName: match[1].trim(),
          artistName: match[2].trim()
        };
      }
      return null;
    }).filter(Boolean);
  } catch (error) {
    console.error('Error parsing recommendations:', error);
    return [];
  }
};

export const getAIRecommendations = async (selectedSongs) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Based on these songs:
${selectedSongs.map((song, i) => `${i + 1}. "${song.name}" by ${song.artists[0].name}`).join('\n')}

Please recommend 10 similar songs. Use EXACTLY this format for each recommendation:
1. "Song Title" by Artist Name
2. "Song Title" by Artist Name
etc.

Each line should start with a number followed by a period, then the song title in quotes, then "by", then the artist name.
Do not include any other text, explanations, or descriptions. Just the numbered list in the exact format specified.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return parseRecommendations(text);
  } catch (error) {
    console.error('Error in getAIRecommendations:', error);
    throw error;
  }
};

export const getAIPlaylistSuggestions = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const fullPrompt = `Create a playlist of 15 songs that match this theme: "${prompt}"

Please use EXACTLY this format for each song:
1. "Song Title" by Artist Name
2. "Song Title" by Artist Name
etc.

Each line should start with a number followed by a period, then the song title in quotes, then "by", then the artist name.
Do not include any other text, explanations, or descriptions. Just the numbered list in the exact format specified.`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    return parseRecommendations(text);
  } catch (error) {
    console.error('Error in getAIPlaylistSuggestions:', error);
    throw error;
  }
};