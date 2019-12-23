module.exports = function(io, Global) {
    const global = new Global();
    io.on('connection', (socket) => {
        console.log('Joined Global Room');
        socket.on('global room', (data) => {
            socket.join(data.room)
            console.log(data);
            
            global.EnterRoom(socket.id, data.name, data.room, data.img)

            io.to(data.room).emit('loggedInUser', global.GetRoomList(data.room));
        })
        socket.on('disconnect', () => {
            var user = global.LeaveRoom(socket.id);
            
            if(user){
                io.to(user.room).emit('loggedInUser', global.GetRoomList(user.room));
            }
        })
        
    })
}