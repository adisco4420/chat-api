'use strict';

module.exports = function() {
    return {
        signupValidation : (req, res, next) => {
            req.checkBody('username', 'Username is required').notEmpty()
            req.checkBody('username', 'Username must not be less then 5').isLength({min: 5});
            req.checkBody('email', 'Email is required').notEmpty()
            req.checkBody('email', 'Email must be a valid email').isEmail();
            req.checkBody('password', 'Password is required').notEmpty()
            req.checkBody('password', 'Password must not be less then 5').isLength({min: 5});

            req.getValidationResult().then(result => {
                const errors = result.array();
                const messages = [];
                errors.forEach((error) => messages.push(error.msg));
                // for api use
                // if(messages.length) {
                //     res.status(403).json({status: 'error', messages})
                // } else {
                // //   console.log('error');
                //     return next()
                  
                // }

                req.flash('error', messages);
                res.redirect('/signup')
            }).catch((err) => {
                return next()
            })

        
        },
        loginValidation : (req, res, next) => {
            req.checkBody('email', 'Email is required').notEmpty()
            req.checkBody('email', 'Email must be a valid email').isEmail();
            req.checkBody('password', 'Password is required').notEmpty()
            req.checkBody('password', 'Password must not be less then 5').isLength({min: 5});
            req.getValidationResult().then(result => {
                const errors = result.array();
                const messages = [];
                errors.forEach((error) => messages.push(error.msg));
                // for api use
                // if(messages.length) {
                //     res.status(403).json({status: 'error', messages})
                // } else {
                // //   console.log('error');
                //     return next()
                  
                // }

                req.flash('error', messages);
                res.redirect('/')
            }).catch((err) => {
                return next()
            })

        
        }
        
    }
}