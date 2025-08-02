// File: netlify/functions/youtube.js (Updated for Debugging)

import fetch from 'node-fetch';

exports.handler = async function(event, context) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
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

    // --- DEBUGGING LINE ---
    // This will print the full response from YouTube into your Netlify log.
    console.log(JSON.stringify(data, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data from YouTube API' }),
    };
  }
};
