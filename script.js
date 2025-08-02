// File: script.js (Completely Revised)

// ⬇️ PASTE YOUR PUBLIC PLAYLIST ID HERE ⬇️
const PLAYLIST_ID = 'https://music.youtube.com/playlist?list=PLUBkN8uE6ti6-CoU9ED8jQwani8Sb_a0h&si=eZ44it-VcxLqRMIS';

// --- DOM ELEMENTS ---
const playlistDiv = document.getElementById('playlist');
const playlistTitleH1 = document.getElementById('playlist-title');

// --- GLOBAL VARIABLES ---
let player; // To hold the YouTube player instance

// --- INITIALIZATION ---
window.onload = function() {
    loadYouTubePlayerAPI();
    getPlaylistVideos();
};

/**
 * Fetches videos by calling OUR backend function, not Google directly.
 */
async function getPlaylistVideos() {
    // This is the endpoint for the function we created above
    const ourApiUrl = `/.netlify/functions/youtube?playlistId=${PLAYLIST_ID}`;

    try {
        const response = await fetch(ourApiUrl);
        const data = await response.json();
        
        // The YouTube data is inside the 'items' property
        const items = data.items;

        if (items && items.length > 0) {
            displayPlaylist(items);
            // Cue the first video by default
            if (player) {
                player.cueVideoById(items[0].snippet.resourceId.videoId);
            }
        } else {
            playlistDiv.innerHTML = '<p>No videos found in this playlist.</p>';
        }
    } catch (error) {
        console.error("Error fetching playlist:", error);
        playlistDiv.innerHTML = '<p>Error loading playlist.</p>';
    }
}


/**
 * Renders the fetched playlist items on the page. (This function is the same as before)
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

// --- YOUTUBE IFRAME PLAYER API (These functions are the same as before) ---

function loadYouTubePlayerAPI() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/playlist?list=PL...";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        playerVars: { 'playsinline': 1 }
    });
}

function playVideo(videoId) {
    if (player && typeof player.loadVideoById === 'function') {
        player.loadVideoById(videoId);
    } else {
        console.error("Player is not ready.");
    }

}
