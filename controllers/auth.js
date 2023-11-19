const User = require('../models/user')

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      isAuthenticated: req.session.isLoggedIn
    });
};
exports.postLogin = (req, res, next) => {
    User.findById("65511508f986df69995597c6")
        .then(user=>{
            req.session.user = user;
            req.session.isLoggedIn = true;
            req.session.save((err)=>{
                console.log(err);
                res.redirect("/")
            })
        })
        .catch(err=>console.log(err))    
}

exports.postLogout = (req, res, next) => {
   req.session.destroy((err)=>{
    console.log(err)
    res.redirect('/')
   })
}