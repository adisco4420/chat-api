class Global {
    constructor(){
        this.globalRoom = [];
    }
    
    EnterRoom(id, name, room, img){
        var user = {id, name, room, img};
        const checkUser = this.globalRoom.filter(user => user.name == name);
        if(!checkUser.length) {
            this.globalRoom.push(user);
        }
        return user;
    }
    
    LeaveRoom(id){
        var user = this.GetUser(id);
        if(user){
            this.globalRoom = this.globalRoom.filter((user) => user.id !== id);
        }
        return user;
    }
    
    GetUser(id){
        var getUser = this.globalRoom.filter((userId) => {
            return userId.id === id;
        })[0];
        return getUser;
    }
    
    GetRoomList(room){
        var users = this.globalRoom.filter((user) => user.room === room);
        
        var namesArray = users.map((user) => {
            return {
                name: user.name,
                img: user.img
            };
        });
        
        return namesArray;
    }
}

module.exports = {Global};