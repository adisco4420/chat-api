module.exports = function(io, Users) {
    const users = new Users();
    io.on('connection', (socket) => {
        console.log('User Connected');
        socket.on('join', (data, callback) => {
            socket.join(data.room)

            users.AddUserData(socket.id, data.name, data.room);

            io.to(data.room).emit('usersList', users.GetUsersList(data.room));
            callback()
        })
        socket.on('createMessage', (data, callback) => {
            io.to(data.room).emit('newMessage', {
                text: data.text,
                room: data.room,
                sender: data.sender,
                image: data.userPic
            })
            callback()
        })
        socket.on('disconnect', () => {
            var user = users.RemoveUser(socket.id);
            
            if(user){
                io.to(user.room).emit('usersList', users.GetUsersList(user.room));
            }
        })
    })
}