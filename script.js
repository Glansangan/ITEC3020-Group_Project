
// ---------------------------------------------------------------------Pomodoro Timmer----------------------------------------------------------------------------------------
// Timer state variables
let longTimer = 20 * 60; // 20 minutes in seconds
let shortTimer = 5 * 60; // 5 minutes in seconds
let currentTime = longTimer;
let isRunning = false;
let timerId = null;
let isLongTimer = true; // true for 20min, false for 5min

// Format time from seconds to MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Update the display
function updateTimerText(timeDisplay) {
    timeDisplay.textContent = formatTime(currentTime);
}

// Start/Stop timer functionality
function toggleTimer(timeDisplay, startBtn) {
    if (!isRunning) {
        // Start timer
        isRunning = true;
        startBtn.textContent = 'Pause';
        
        timerId = setInterval(() => {
            currentTime--;
            updateTimerText(timeDisplay);
            
            // Timer finished
            if (currentTime <= 0) {
                stopTimer(startBtn);
                alert('Timer finished!');
                resetTimer(timeDisplay, startBtn);
            }
        }, 1000 /* 1 second */);
    } else {
        // Pause timer
        stopTimer(startBtn);
    }
}

// Stop the timer
function stopTimer(startBtn) {
    isRunning = false;
    startBtn.textContent = 'Start';
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
}

// Reset timer and switch between 20min/5min
function resetTimer(timeDisplay, startBtn) {
    stopTimer(startBtn);
    
    // Toggle between the long and short timer
    if (isLongTimer) {
        currentTime = shortTimer;
        isLongTimer = false;
    } else {
        currentTime = longTimer;
        isLongTimer = true;
    }
    
    updateTimerText(timeDisplay);
}

// Only run timer code if we're on the timer page
if (window.location.pathname.endsWith('timer.html')) {
    // DOM elements
    const timeDisplay = document.getElementById('timerDisplay');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');

    // Event listeners
    startBtn.addEventListener('click', () => toggleTimer(timeDisplay, startBtn));
    resetBtn.addEventListener('click', () => resetTimer(timeDisplay, startBtn));

    // Initialize display
    updateTimerText(timeDisplay);
}


// -------------------------------------------------------------Note Popout Form------------------------------------------------------------------------------------------------

function openNotesForm() {
    document.getElementById('notesFormOverlay').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeNotesForm() {
    document.getElementById('notesFormOverlay').style.display = 'none';
    document.body.style.overflow = 'auto';
}

document.getElementById('notesForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('title').value.trim();
    const note = document.getElementById('note').value.trim();

    if (!title && !note) return;
    
    const noteDiv = document.createElement('div');
    noteDiv.className = 'noteCard';
    noteDiv.innerHTML = 
    `<h3>${title || 'Untitled'}</h3>
    <p>${note}</p>`;

    document.getElementById('notesWrapper').appendChild(noteDiv);

    document.getElementById('notesForm').reset();
    closeNotesForm();
});