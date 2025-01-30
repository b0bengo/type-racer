document.addEventListener('DOMContentLoaded', function () {
    const easyTexts = [
        "The cat sat on the mat.",
        "A quick brown fox jumps over the lazy dog.",
        "She sells seashells by the seashore."
    ];

    const mediumTexts = [
        "To be or not to be, that is the question.",
        "All that glitters is not gold.",
        "A journey of a thousand miles begins with a single step."
    ];

    const hardTexts = [
        "It was the best of times, it was the worst of times.",
        "In the beginning God created the heavens and the earth.",
        "The only thing we have to fear is fear itself."
    ];

    const difficultySelect = document.getElementById('difficulty');
    const sampleTextDiv = document.getElementById('sample-text');
    const startButton = document.getElementById('start-btn');
    const stopButton = document.getElementById('stop-btn');
    const retryButton = document.getElementById('retry-btn');
    const instructionsButton = document.getElementById('instructions-btn');
    const timeDisplay = document.getElementById('time');
    const userInput = document.getElementById('user-input');
    const levelDisplay = document.getElementById('level');
    const wpmDisplay = document.getElementById('wpm');
    const highlightedTextDiv = document.createElement('div');
    highlightedTextDiv.id = 'highlighted-text';
    userInput.parentNode.insertBefore(highlightedTextDiv, userInput.nextSibling);

    let startTime;
    let endTime;
    let testStarted = false;

    function getRandomText(textArray) {
        const randomIndex = Math.floor(Math.random() * textArray.length);
        return textArray[randomIndex];
    }

    function updateSampleText() {
        let selectedDifficulty = difficultySelect.value;
        let selectedText;

        if (selectedDifficulty === 'easy') {
            selectedText = getRandomText(easyTexts);
        } else if (selectedDifficulty === 'medium') {
            selectedText = getRandomText(mediumTexts);
        } else if (selectedDifficulty === 'hard') {
            selectedText = getRandomText(hardTexts);
        }

        sampleTextDiv.textContent = selectedText;
    }

    function startTest() {
        if (!testStarted) {
            startTime = new Date();
            testStarted = true;
            startButton.disabled = true;
            stopButton.disabled = false;
            userInput.disabled = false;
            userInput.value = ''; // Clear the input area
            highlightedTextDiv.innerHTML = ''; // Clear the highlighted text area
            userInput.focus();
        }
    }

    function stopTest() {
        endTime = new Date();
        const timeTaken = (endTime - startTime) / 1000; // time in seconds
        const wpm = calculateWPM(timeTaken);
        
        displayResults(timeTaken, wpm);

        startButton.disabled = false;
        stopButton.disabled = true;
        userInput.disabled = true;
        testStarted = false;
    }

    function calculateWPM(timeTaken) {
        const sampleText = sampleTextDiv.textContent.trim();
        const userText = userInput.value.trim();
        const sampleWords = sampleText.split(" ");
        const userWords = userText.split(" ");
    
        let correctWords = 0;
        for (let i = 0; i < userWords.length; i++) {
            if (userWords[i] === sampleWords[i]) {
                correctWords++;
            }
        }
    
        return Math.round((correctWords / timeTaken) * 60);
    }

    function displayResults(timeTaken, wpm) {
        timeDisplay.textContent = timeTaken.toFixed(2);
        wpmDisplay.textContent = wpm;
        const selectedDifficulty = difficultySelect.value;
        levelDisplay.textContent = selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1);
    }

    function highlightText() {
        const sampleText = sampleTextDiv.textContent.trim();
        const userText = userInput.value.trim();
        const sampleWords = sampleText.split(" ");
        const userWords = userText.split(" ");
    
        let highlightedText = '';
        for (let i = 0; i < userWords.length; i++) {
            if (userWords[i] === sampleWords[i]) {
                highlightedText += `<span style="color: blue;">${userWords[i]}</span> `;
            } else {
                highlightedText += `<span style="color: red;">${userWords[i]}</span> `;
            }
        }
    
        highlightedTextDiv.innerHTML = highlightedText;
    }

    function retryTest() {
        userInput.value = '';
        highlightedTextDiv.innerHTML = '';
        timeDisplay.textContent = '0';
        wpmDisplay.textContent = '0';
        startButton.disabled = false;
        stopButton.disabled = true;
        userInput.disabled = false;
        testStarted = false;
        updateSampleText();
    }

    difficultySelect.addEventListener('change', updateSampleText);
    startButton.addEventListener('click', startTest);
    stopButton.addEventListener('click', stopTest);
    retryButton.addEventListener('click', retryTest);
    instructionsButton.addEventListener('click', function () {
        const instructionsModal = new bootstrap.Modal(document.getElementById('instructionsModal'));
        instructionsModal.show();
    });
    userInput.addEventListener('input', function () {
        if (!testStarted) {
            startTest();
        }
        highlightText();
    });
    userInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            stopTest();
        }
    });

    // Initialise with a random text from the default difficulty level
    updateSampleText();
});