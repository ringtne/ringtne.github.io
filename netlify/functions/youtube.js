// File: netlify/functions/youtube.js

// Using node-fetch to make the API request. You'll need to install it.
import fetch from 'node-fetch';

// The main function that Netlify will run
exports.handler = async function(event, context) {
  // Get the secret API key from the environment variables
  const API_KEY = process.env.YOUTUBE_API_KEY;
  
  // Get the playlist ID passed from the front-end
  const PLAYLIST_ID = event.queryStringParameters.playlistId;

  if (!PLAYLIST_ID) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Playlist ID is required' }),
    };
  }
  
  const API_URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&key=${API_KEY}&maxResults=50`;

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data), // Pass the YouTube data back to the front-end
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data from YouTube API' }),
    };
  }
};
