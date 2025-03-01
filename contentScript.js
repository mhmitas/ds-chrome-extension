function handleVideoPlay() {
    const video = document.querySelector('video');

    if (video) {
        // Check if video is already playing when page loads
        if (!video.paused) {
            showMessage('Video is playing! 🎥');
        }

        // Add event listener for future play events
        video.addEventListener('play', () => {
            showMessage('Video is playing! 🎥');
        });
    }
}

function showMessage(message) {
    // Remove existing message if any
    const existingMessage = document.querySelector('.yt-message');
    if (existingMessage) existingMessage.remove();

    // Create new message
    const msgDiv = document.createElement('div');
    msgDiv.className = 'yt-message';
    msgDiv.textContent = message;

    document.body.appendChild(msgDiv);

    // Remove message after 5 seconds
    setTimeout(() => {
        msgDiv.remove();
    }, 5000);
}

// Initialize when page loads
window.addEventListener('load', handleVideoPlay);

// Re-run when page changes (SPA navigation)
document.addEventListener('yt-navigate-finish', handleVideoPlay);