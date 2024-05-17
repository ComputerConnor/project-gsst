// Establish a connection to the server
const socket = io();

let nickname; // Variable to store the contestant's nickname
let startTime; // Variable to store the start time of asking a question

// Event handler for successful connection
socket.on('connect', () => {
    console.log('Connected to server');
    setNickname();
});

// Function to prompt the user to set a nickname
function setNickname() {
    while (!nickname || nickname.trim() === '') {
        nickname = prompt('Please enter your nickname:');
        if (!nickname || nickname.trim() === '') {
            alert('Please enter a valid nickname.');
        }
    }
    socket.emit('setNickname', nickname);
    document.getElementById('nickname').value = nickname;
    document.getElementById('nickname').disabled = true; // Disable the nickname input field
    document.querySelector('button').disabled = false; // Enable the Buzz In button
}

// Event handler for when someone buzzes in
socket.on('buzz', (data) => {
    console.log(`${data.nickname} buzzed in at ${data.time}`);
    // Add your buzz-in logic here
});

// Function to handle buzzing in
function buzzIn() {
    console.log('Buzzing in');
    const timeSinceStart = calculateTimeSinceStart(startTime);
    socket.emit('buzz', { nickname, timeSinceStart });
}

// Function to handle starting to ask a question
function startAskingQuestion() {
    console.log('Starting to ask a question');
    startTime = new Date();
}

// Function to calculate the time since starting to ask a question
function calculateTimeSinceStart(startTime) {
    if (!startTime) return 'Not started yet';
    const currentTime = new Date();
    const elapsedTime = currentTime - startTime;
    return `${Math.floor(elapsedTime / 1000)} seconds`;
}
