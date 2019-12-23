module.exports = function(Users, async ) {
    return {
        SetRouting: function(router) {
            router.get('/group/:name', this.GroupPage )
            router.post('/group/:name', this.SendFriendRequest)
            router.post('/group/accept-friend/:name', this.AcceptFriendRequest)
            router.post('/group/cancel-friend/:name', this.CancelFrientRequest)

            router.get('/logout', this.logout)
        },
        GroupPage: (req, res) => {
            async.parallel([
                function(callback) {
                    Users.findOne({username: req.user.username})
                         .populate('request.userId')
                         .exec((err, result) => {
                             callback(err, result)
                         })
                }
            ], (err, result) => {
                const res1 = result[0]                                  
                res.render('groupchat/group', {
                    title: req.params.name, 
                    user: req.user || { username: 'anonymous'},
                    data: res1
                })
            })
            

        },
        SendFriendRequest: (req, res) => {
            async.parallel([
                function(callback) {
                    if(req.body.receiverName) {
                        Users.update({
                            'username': req.body.receiverName,
                            'request.userId': {$ne: req.user._id},
                            'friendsList.friendId': {$ne: req.user._id}
                        },
                        {
                            $push: { request: {
                                userId: req.user._id,
                                username: req.user.username
                            }},
                            $inc: { totalRequest: 1}
                        }, (err, count) => {
                            callback(err,count)
                        })
                    }
                },
                function(callback) {
                    if(req.body.receiverName) {
                        Users.update({
                            'username': req.user.username,
                            'sentRequest.username': {$ne: req.body.receiverName},
                        },
                        {
                            $push: { sentRequest: {
                                username: req.body.receiverName
                            }},
                        }, (err, count) => {
                            callback(err,count)
                        })
                    }
                },

            ], (err, results) => {
                res.redirect('/group/'+ req.params.name)
            })            
        },
        AcceptFriendRequest: (req, res) => {
            async.parallel([
                // This function updates user friend list, request and totalRequest
                function(callback) {
                    if(req.body.senderId) {
                        Users.update({
                            '_id': req.user._id,
                            'friendsList.friendId': {$ne: req.body.senderId}
                        },
                        {
                            $push: { friendsList: {
                                friendId: req.body.senderId,
                                friendName: req.body.senderName
                            }},
                            $pull: { request: {
                                userId: req.body.senderId,
                                username: req.body.senderName
                            }},
                            $inc: { totalRequest: -1}
                        }, (err, count) => {
                            callback(err,count)
                        })
                    }
                },
                // This function updates sender friend list, sendRequest

                function(callback) {
                    if(req.body.senderId) {
                        Users.update({
                            '_id': req.body.senderId,
                            'friendsList.friendId': {$ne: req.user._id}
                        },
                        {
                            $push: { friendsList: {
                                friendId: req.user._id,
                                friendName: req.user.username
                            }},
                            $pull: { sentRequest: {
                                username: req.user.username
                            }},
                        }, (err, count) => {
                            callback(err,count)
                        })
                    }
                },


            ], (err, results) => {
                res.redirect('/group/'+ req.params.name)
            })            
        },
        CancelFrientRequest: (req, res) => {
            async.parallel([
                function(callback) {
                    if(req.body.user_Id) {
                        Users.update({
                            '_id': req.user._id,
                            'request.userId': {$eq: req.body.user_Id},
                        },
                        {
                            $pull: { request: {
                                userId: req.body.user_Id,
                            }},
                            $inc: { totalRequest: -1}
                        }, (err, count) => {
                            callback(err,count)
                        })
                    }
                },
                function(callback) {
                    if(req.body.user_Id) {
                        Users.update({
                            'username': req.body.user_Id,
                            'sentRequest.username': {$ne: req.user.username},
                        },
                        {
                            $pull: { sentRequest: {
                                username: req.user.username
                            }},
                        }, (err, count) => {
                            callback(err,count)
                        })
                    }
                },

            ], (err, results) => {
                res.redirect('/group/'+ req.params.name)
            })      
        },
        logout: function(req, res){
            req.logout();
            req.session.destroy((err) => {
               res.redirect('/');
            });
        }
    }
}