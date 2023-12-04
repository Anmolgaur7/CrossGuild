const express = require('express');
const app = express();
const server= require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});
const port = 3000;

io.on('connection', socket => {
    socket.emit('me', socket.id);
    socket.on('disconnect', body => {
        socket.broadcast.emit('call ended')
    })
    socket.on('calluser', (data) => {
        io.to(data.userToCall).emit('calluser', { signal: data.signalData, from:data.from, data:data.name});
    })
    socket.on('answercall', (data) => {
        io.to(data.to).emit('callaccepted', data.signal)
    })
})
app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
