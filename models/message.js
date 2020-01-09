const moongose = require('mongoose');
const defaultPix = 'https://recap-project.eu/wp-content/uploads/2017/02/default-user.jpg'

const MessageSchema = new moongose.Schema({
    message: {type: String},
    sender: {type: moongose.Schema.Types.ObjectId, ref: 'User'},
    reciever: {type: moongose.Schema.Types.ObjectId, ref: 'User'},
    senderName: {type: String},
    recieverName: {type: String},
    userImage: {type: String, default: defaultPix},
    isRead: { type: Boolean, default: false},
    createdAt: { type: Date, default: new Date()}
})

module.exports = moongose.model('Message', MessageSchema);