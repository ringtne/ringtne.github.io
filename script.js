// File: script.js (Final Robust Version)

// ⬇️ PASTE YOUR PUBLIC PLAYLIST ID HERE ⬇️
const PLAYLIST_ID = 'PLUBkN8uE6ti6-CoU9ED8jQwani8Sb_a0h';

// --- DOM ELEMENTS ---
const playlistDiv = document.getElementById('playlist');
const playlistTitleH1 = document.getElementById('playlist-title');

// --- GLOBAL VARIABLES ---
let player; // To hold the YouTube player instance

// --- INITIALIZATION ---
// On load, we ONLY start loading the YouTube player API.
window.onload = function() {
    loadYouTubePlayerAPI();
};

/**
 * Fetches videos by calling OUR backend function.
 */
async function getPlaylistVideos() {
    const ourApiUrl = `/.netlify/functions/youtube?playlistId=${PLAYLIST_ID}`;
    try {
        const response = await fetch(ourApiUrl);
        const data = await response.json();
        const items = data.items;

        if (items && items.length > 0) {
            displayPlaylist(items);
            // The player is guaranteed to be ready here, so we can load the video.
            player.loadVideoById(items[0].snippet.resourceId.videoId);
        } else {
            playlistDiv.innerHTML = '<p>No videos found in this playlist.</p>';
        }
    } catch (error) {
        console.error("Error fetching playlist:", error);
        playlistDiv.innerHTML = '<p>Error loading playlist.</p>';
    }
}


/**
 * Renders the fetched playlist items on the page.
 */
function displayPlaylist(items) {
    playlistDiv.innerHTML = ''; // Clear previous items
    items.forEach(item => {
        const snippet = item.snippet;
        const videoId = snippet.resourceId.videoId;
        const title = snippet.title;
        const thumbnailUrl = (snippet.thumbnails && snippet.thumbnails.default) ? snippet.thumbnails.default.url : 'https://www.youtube.com/iframe_api';

        const videoElement = document.createElement('div');
        videoElement.className = 'playlist-item';
        videoElement.innerHTML = `
            <img src="${thumbnailUrl}" alt="Thumbnail for ${title}">
            <p>${title}</p>
        `;
        videoElement.onclick = () => playVideo(videoId);
        playlistDiv.appendChild(videoElement);
    });
}

// --- YOUTUBE IFRAME PLAYER API ---

function loadYouTubePlayerAPI() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/playlist?list=PL...";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

/**
 * This function is the main entry point after the player is ready.
 */
window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        playerVars: {
            'playsinline': 1,
            'autoplay': 1,
            'mute': 1
        },
        events: {
            // We'll wait for the 'onReady' event before fetching the playlist.
            'onReady': onPlayerReady
        }
    });
}

/**
 * Once the player is fully ready, we will finally fetch the video list.
 */
function onPlayerReady(event) {
    getPlaylistVideos();
}

/**
 * Plays a new video when a user clicks on an item in the playlist.
 */
function playVideo(videoId) {
    if (player && typeof player.loadVideoById === 'function') {
        player.loadVideoById(videoId);
    } else {
        console.error("Player is not ready.");
    }
}
