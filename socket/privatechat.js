module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log('Private Chat Connected');
        socket.on('join PM', (data) => {
            socket.join(data.room1);
            socket.join(data.room2);
        })
        socket.on('private message', (data, callback) => {
            io.to(data.room).emit('new message', {
                text: data.text,
                sender: data.sender,
            })
            io.emit('display message', {})
            callback()
        })
    })
}