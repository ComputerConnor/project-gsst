// Establish a connection to the server
const socket = io();

// Function to handle starting to ask a question
function startAskingQuestion() {
    console.log('Starting to ask a question');
    const startTime = new Date();
    const formattedStartTime = startTime.toLocaleTimeString();
    socket.emit('startQuestion', { startTime: formattedStartTime });
}
