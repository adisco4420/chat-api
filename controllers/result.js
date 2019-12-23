module.exports = function(async , Club) {
    return {
        SetRouting: function(router) {
            router.get('/results', this.ResultPage),
            router.post('/results', this.PostResult)
        },
        ResultPage: function(req, res) {
          res.redirect('/home')
        },
        PostResult: function(req, res) {
            async.parallel([
                function(callback) {
                    const regex = new RegExp((req.body.country), 'gi');
                    Club.find({'$or': [
                        {'country': regex},
                        {'name': regex}
                    ]}, (err, result) => {
                        callback(err, result)
                    })
                }
            ], (err, results) => {
                const clubs = results[0];

                res.render('result', {
                    title: 'Footballkik - Home',  
                    user: req.user,
                    clubs
                })
            })
        }
    }
}