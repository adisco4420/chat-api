module.exports = function(async, Users, Messages) {
    return {
        SetRouting: function(router) {
            router.get('/chat/:name' , this.getChat);
            router.post('/chat/:name', this.saveMessage)
        },
        getChat: function(req, res) {
            async.parallel([
                function(callback){
                    Users.findOne({'username': req.user.username})
                        .populate('request.userId')
                        .exec((err, result) => {
                            callback(err, result);
                        })
                },
                
                function(callback){
                    const nameRegex = new RegExp("^" + req.user.username.toLowerCase(), "i")
                    Messages.aggregate([
                        {  
                            $match:
                                {
                                   $or:[{"senderName":nameRegex}, {"receiverName":nameRegex}]
                                }
                        },
                        {
                            $sort:{"createdAt":-1}
                        },
                        {
                            $group:{
                                "_id": {
                                    "last_message_between":{
                                    $cond:[
                                        {
                                            $gt:[
                                            {$substr:["$senderName",0,1]},
                                            {$substr:["$recieverName",0,1]}]
                                        },
                                        {$concat:["$senderName"," and ","$recieverName"]},
                                        {$concat:["$recieverName"," and ","$senderName"]}
                                        ] 
                                        }
                                    }, 
                                "body": {$first:"$$ROOT"}
                        }
                            
                    }], (err, newResult) => {
                        console.log(newResult);
                        
                        callback(err, newResult);
                        return
                       const arr = [
                           {path: 'body.sender', model: 'User'},
                           {path: 'body.receiver', model: 'User'}
                       ];
                       Messages.populate(newResult, arr, (err, newResult1) => {
                           callback(err, newResult1);
                       });
                    });
                },
                
                function(callback){
                    Messages.find({'$or':[{'senderName':req.user.username}, {'recieverName':req.user.username}]})
                        .populate('sender')
                        .populate('reciever')
                        .exec((err, result3) => {
                            callback(err, result3)
                        })
                }
            ], (err, results) => {
                const result1 = results[0];
                const result2 = results[1];
                const result3 = results[2];
                
                const params = req.params.name.split('.');
                const nameParams = params[0];
                
                res.render('privatechat/private', {
                    title: 'Footballkik - Private Chat', 
                    user:req.user, 
                    data: result1, 
                    chat: result2, 
                    chats:result3, 
                    name:nameParams});
            });
        },
        saveMessage: function(req, res, next) {
            const params = req.params.name.split('.');
            const nameParam = params[0]
            console.log(nameParam);
            
            const nameRegex = new RegExp('^'+ nameParam.toLowerCase(), 'i')
            async.waterfall([
                function(callback) {
                    if(req.body.message) {
                        Users.findOne({'username': {'$regex': nameRegex}}, (err , data) => {                            
                            if(err) {
                                return next(err);
                            }
                            callback(err, data)

                        })
                    }
                }, 
                function(data, callback) {
                    if(req.body.message && data) {                                                
                        const newMessage = new Messages();
                        newMessage.message = req.body.message;
                        newMessage.sender = req.user._id;
                        newMessage.senderName = req.user.username;
                        newMessage.reciever = data._id;
                        newMessage.recieverName = data.username;
                        newMessage.userImage = req.user.userImage,
                        newMessage.createdAt = new Date()
                        newMessage.save((err, result ) => {
                            if(err) {
                                return next(err)
                            }
                            console.log(result);
                            callback(err, result)
                        })
                    }
                }
            ], (err , results) => {
                res.redirect('/chat/'+ req.params.name)
            })
        }
    }
}