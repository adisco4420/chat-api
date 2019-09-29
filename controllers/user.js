'use strict';

module.exports = function(_) {
    return {
        setRouting: function(router) {
            router.get('/', this.indexPage)
            router.get('/signup', this.getSignUp)
        },
        indexPage: function(req, res){
            const errors = req.flash('error');
            return res.render('index', {title: 'Footballkk | Login', messages: errors, hasErrors: errors.length > 0});
        },
        
        getSignUp: function(req, res){
            const errors = req.flash('error');
            return res.render('signup', {title: 'Footballkk | SignUp', messages: errors, hasErrors: errors.length > 0});
        },
    }
}