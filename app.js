var express = require('express');
var app = express();

// import socket.io library
const io = require('socket.io')(); // instantiate the library right away with the () method -> makes it run

const port = process.env.PORT || 3030;

// tell express where our static files are (js, images, css etc)
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

const server = app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});

// this is all our socket.io messaging functionality

// attach socket.io
// listen to incoming and outgoing messages on that port
// like a mailbox

io.attach(server);

// direct connection between your computer and your server
io.on('connection', function(socket) {
    console.log('user connected');
    // socket object = sID = could be anything
    socket.emit('connected', {sID: `${socket.id}`, message: 'new connection'});

    // listen for incoming message from a user (socket referes to an individual user)
    // msg = incoming msg from that user
    socket.on('chat_message', function(msg) {
        console.log(msg);
        // when we get msg, send it to everyone
        // io checks who is connected
        // gets the messages

        io.emit('new_message', { id: socket.id, message: msg });
    })

    // listen for a disconnect event - like hanging up a phone
    socket.on('disconnect', function() {
        console.log('a user disconnected');
        // tracking the id tells us who left
        message = `${socket.id} has left the chat`;
        io.emit('user_disconnect', message);
    })
})