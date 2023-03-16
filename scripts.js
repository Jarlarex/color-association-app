const startBtn = document.getElementById("start-btn");
const countdown = document.getElementById("countdown");
const countdownNumber = document.getElementById("countdown-number");
const colorSelection = document.getElementById("color-selection");
const colorsContainer = document.getElementById("colors-container");
const replayBtn = document.getElementById("replay-btn");
const submitBtn = document.getElementById("submit-btn");
const thanksMessage = document.getElementById("thanks-message");
const gamesPlayed = document.getElementById("games-played");
const continueBtn = document.getElementById("continue-btn");

// Add your rainbow colors here
const rainbowColors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

function createColorButtons() {
    rainbowColors.forEach(color => {
        const colorBtn = document.createElement("button");
        colorBtn.classList.add("color-btn");
        colorBtn.style.backgroundColor = color;
        colorBtn.addEventListener("click", () => {
            // Your color selection logic here
            console.log("Selected color:", color);
        });
        colorsContainer.appendChild(colorBtn);
    });
}

function startCountdown() {
    let countdownValue = 3;
    countdownNumber.textContent = countdownValue;
    countdown.hidden = false;

    const countdownInterval = setInterval(() => {
        countdownValue -= 1;
        countdownNumber.textContent = countdownValue;

        if (countdownValue === 0) {
            clearInterval(countdownInterval);
            countdown.hidden = true;
            colorSelection.hidden = false;
            // Play the sound here
        }
    }, 1000);
}

function initGame() {
    createColorButtons();
    startBtn.addEventListener("click", () => {
        startBtn.parentElement.hidden = true;
        startCountdown();
    });

    replayBtn.addEventListener("click", () => {
        // Replay the sound here
    });

    submitBtn.addEventListener("click", () => {
        colorSelection.hidden = true;
        thanksMessage.hidden = false;
        // Save the user's selection and increment the games played counter
    });

    continueBtn.addEventListener("click", () => {
        thanksMessage.hidden = true;
        startCountdown();
    });
}

initGame();

