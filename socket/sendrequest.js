module.exports = function (io) {
    io.on('connection', (socket) => {
        socket.on('joinRequest', (req, callback) => {
            socket.join(req.sender);
            callback()
        })    
        socket.on('friendRequest', (req, callback) => {
            io.to(req.receiver).emit('newFriendRequest', {
                from: req.sender,
                to: req.receiver
            })
            callback();
        })    
    }) 
}