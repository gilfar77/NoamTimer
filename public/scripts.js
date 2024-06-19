// Fetch the initial meeting time from the server
let lastMeetingDate;

fetch('/lastMeetingDate')
    .then(response => response.json())
    .then(data => {
        lastMeetingDate = data.lastMeetingDate;
        updateTimer();
    });

const timerDisplay = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
};

function updateTimer() {
    if (!lastMeetingDate) return;

    const now = new Date().getTime();
    const distance = now - lastMeetingDate;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    timerDisplay.days.textContent = days;
    timerDisplay.hours.textContent = hours;
    timerDisplay.minutes.textContent = minutes;
    timerDisplay.seconds.textContent = seconds;
}

function resetTimer() {
    if (confirm('האם בוודאות נפגשת עם נעם ולא עם מישהו אחר??')) {
        lastMeetingDate = new Date().getTime();
        fetch('/updateMeetingDate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ lastMeetingDate })
        })
        .then(response => response.json())
        .then(data => {
            updateTimer();
            // Fireworks effect
            party.confetti(document.body, {
                count: party.variation.range(50, 100),
                spread: party.variation.range(20, 40),
                size: party.variation.range(0.5, 1.5)
            });
        });
    }
}

document.getElementById('resetButton').addEventListener('click', resetTimer);

setInterval(updateTimer, 1000);
