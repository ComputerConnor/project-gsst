const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve contestant.html
app.get('/contestant', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contestant.html'));
});

// Route to serve questioner.html
app.get('/questioner', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'questioner.html'));
});

// Array to store connected clients with their nicknames
let clients = [];

// Object to store the time when each client buzzed in
let buzzTimes = {};

// Variable to store the start time of asking a question
let questionStartTime;

// Current question index
let currentQuestionIndex = 0;

// Sample questions
const questions = [
    { question: "Name a fruit that is red.", answers: ["Apple", "Strawberry", "Cherry", "Watermelon", "Tomato"] },
    { question: "Name a city in Europe.", answers: ["Paris", "London", "Berlin", "Rome", "Madrid"] },
    // Add more questions as needed
];

// Event handler for new connections
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Event handler for setting the nickname
    socket.on('setNickname', (nickname) => {
        clients.push({ id: socket.id, nickname });
        console.log('Nickname set:', nickname);
    });

    // Event handler for starting to ask a question
    socket.on('startQuestion', ({ startTime }) => {
        console.log(`Questioner started asking at ${startTime}`);
        // Store the start time
        questionStartTime = new Date(startTime);
    });

    // Function to get the time since starting to ask a question
    function getTimeSinceStart() {
        if (!questionStartTime) return 'Not started yet';
        const currentTime = new Date();
        const elapsedTime = currentTime - questionStartTime;
        return `${Math.floor(elapsedTime / 1000)} seconds`;
    }

    // Event handler for buzz-in
    socket.on('buzz', (data) => {
        console.log(`${data.nickname} buzzed in at ${data.timeSinceStart}`);
        // Record the time when the user buzzed in
        buzzTimes[socket.id] = new Date();
        // Calculate the time since starting to ask a question
        const timeSinceStart = getTimeSinceStart();
        // Broadcast the buzz to all clients except the one who buzzed
        socket.broadcast.emit('buzz', { nickname: getClientNickname(socket.id), timeSinceStart });
    });

    // Event handler for disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        clients = clients.filter(client => client.id !== socket.id);
        delete buzzTimes[socket.id];
    });
});

// Function to get the nickname of a client based on their ID
function getClientNickname(id) {
    const client = clients.find(client => client.id === id);
    return client ? client.nickname : 'Unknown';
}

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
