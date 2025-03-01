// Shared variables
let messageTimeout = null;
let observer = null;

// Video play functionality
function handleVideoPlay() {
    const video = document.querySelector('video');

    if (video && !video.hasCustomListener) {
        video.hasCustomListener = true;

        const messageText = `🎥 Please do not play this video if it is not important 🙏.\n You have only ${timeRemaining()}`

        if (!video.paused) {
            showMessage(messageText);
        }

        video.addEventListener('play', () => {
            showMessage(messageText);
        });
    }
}

// Homepage heading functionality
function addHomepageHeading() {
    if (!isYouTubeHomepage()) return;

    const headingText = `🎥 Please do not play this video if it is not important 🙏.\n You have only ${timeRemaining()}`
    const existingHeading = document.querySelector('#yt-custom-heading');
    const videoGrid = document.querySelector('ytd-rich-grid-renderer, ytd-rich-grid-row');

    if (videoGrid && !existingHeading) {
        const heading = document.createElement('div');
        heading.id = 'yt-custom-heading';
        heading.innerHTML = `
      <h2>${headingText}</h2>
      <div class="custom-heading-decoration"></div>
    `;

        videoGrid.parentNode.insertBefore(heading, videoGrid);
    }
}

function isYouTubeHomepage() {
    const path = window.location.pathname;
    return path === '/' ||
        path.includes('/feed/') ||
        path.includes('/subscriptions');
}

function showMessage(message) {
    if (messageTimeout) clearTimeout(messageTimeout);

    const existingMessage = document.querySelector('.yt-message');
    if (existingMessage) existingMessage.remove();

    // const msgDiv = document.createElement('div');
    // msgDiv.className = 'yt-message';
    // msgDiv.textContent = message;
    // document.body.appendChild(msgDiv);
    const msgDiv = document.createElement('div');
    msgDiv.className = 'yt-message';
    msgDiv.innerHTML = message.replace(/\n/g, '<br>');
    document.body.appendChild(msgDiv);

    messageTimeout = setTimeout(() => msgDiv.remove(), 5000);
}

// Unified initialization
function initExtension() {
    handleVideoPlay();
    addHomepageHeading();
}

// Event listeners
function setupListeners() {
    window.addEventListener('load', initExtension);
    document.addEventListener('yt-navigate-finish', initExtension);

    // Single observer instance
    if (!observer) {
        observer = new MutationObserver((mutations) => {
            if (document.querySelector('video') || isYouTubeHomepage()) {
                initExtension();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// Start the extension
setupListeners();

// let messageTimeout = null;

// function handleVideoPlay() {
//     const video = document.querySelector('video');

//     if (video && !video.hasCustomListener) {
//         video.hasCustomListener = true; // Mark video as handled

//         const messageText = `🎥 Please do not play this video if it is not important 🙏.\n You have only ${timeRemaining()}`

//         // Show message if video is already playing
//         if (!video.paused) {
//             showMessage(messageText);
//         }

//         // Add play event listener
//         video.addEventListener('play', () => {
//             showMessage(messageText);
//         });
//     }
// }

// function showMessage(message) {
//     // Clear any pending removal
//     if (messageTimeout) {
//         clearTimeout(messageTimeout);
//         messageTimeout = null;
//     }

//     // Remove existing message
//     const existingMessage = document.querySelector('.yt-message');
//     if (existingMessage) existingMessage.remove();

//     // Create new message
//     const msgDiv = document.createElement('div');
//     msgDiv.className = 'yt-message';
//     msgDiv.innerHTML = message.replace(/\n/g, '<br>');
//     document.body.appendChild(msgDiv);

//     // Remove message after 5 seconds
//     messageTimeout = setTimeout(() => {
//         msgDiv.remove();
//     }, 7000);
// }

// // Initialize with debouncing
// function init() {
//     handleVideoPlay();
// }

// // Run on initial load
// window.addEventListener('load', init);

// // Run after SPA navigation
// document.addEventListener('yt-navigate-finish', init);

// // Additional check for dynamic player loading
// const observer = new MutationObserver(init);
// observer.observe(document.body, {
//     childList: true,
//     subtree: true
// });

function timeRemaining() {
    const now = new Date();
    const targetDate = new Date('2025-04-30T00:00:00');

    const diffMs = targetDate - now;

    if (diffMs <= 0) {
        return "The target date has already passed.";
    }

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${days} days, ${hours} hours, and ${minutes} minutes left.`;
}
