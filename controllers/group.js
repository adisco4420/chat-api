module.exports = function() {
    return {
        SetRouting: function(router) {
            router.get('/group/:name', this.groupPage )
        },

        groupPage: (req, res) => {
            res.render('groupchat/group', {title: req.params.name})
        }
    }
}