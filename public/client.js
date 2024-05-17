// Establish a connection to the server
const socket = io();

let startTime; // Variable to store the start time of asking a question

// Event handler for successful connection
socket.on('connect', () => {
    console.log('Connected to server');
    const nickname = prompt('Enter your nickname:');
    socket.emit('setNickname', nickname);
});

// Event handler for when someone buzzes in
socket.on('buzz', (data) => {
    console.log(`${data.nickname} buzzed in at ${data.time}`);
    // Add your buzz-in logic here
});

// Event handler for receiving the next question
socket.on('nextQuestion', (question) => {
    console.log('Next question:', question.question);
    // Add your code to display the next question on the client side
});

// Function to handle buzzing in
function buzzIn() {
    console.log('Buzzing in');
    socket.emit('buzz');
}

// Function to handle starting to ask a question
function startAskingQuestion() {
    console.log('Starting to ask a question');
    startTime = new Date();
}

// Function to handle submitting an answer
function submitAnswer() {
    const answer = document.getElementById('answer').value;
    console.log('Submitting answer:', answer);
    socket.emit('answer', { answer });
}

// Function to get the time since starting to ask a question
function getTimeSinceStart() {
    if (!startTime) return 'Not started yet';
    const currentTime = new Date();
    const elapsedTime = currentTime - startTime;
    return `${Math.floor(elapsedTime / 1000)} seconds`;
}
