const bcrypt = require('bcryptjs');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "f61c1277a03593",
      pass: "968416868641fe"
    }
  });

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if(message.length>0){
        message = message[0]
    }else{
        message = null;
    }
    res.render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      isAuthenticated: req.session.isLoggedIn,
      errorMessage: message
    });
};
exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
        .then(user=>{
            if(!user){
                req.flash('error', 'Invalid username or password');
                return res.redirect("/login");
            }
            bcrypt.compare(password, user.password)
                    .then(doMatch=>{
                        if(doMatch){
                            req.session.user = user;
                            req.session.isLoggedIn = true;
                            return req.session.save((err)=>{
                                console.log(err);
                                res.redirect("/");
                            })
                        }
                        req.flash('error', 'Invalid username or password');
                        res.redirect('/login');
                    })
                    .catch(err=>{
                        res.redirect("/login");
                    })
        })
        .catch(err=>{
            //res.redirect('/500')
            const error = new Error(err);
            error.httpStatusCide = 500;
            return next(error);
          })    
}

exports.postLogout = (req, res, next) => {
   req.session.destroy((err)=>{
    console.log(err)
    res.redirect('/')
   })
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if(message.length>0){
        message = message[0]
    }else{
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false,
        errorMessage: message
    });
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({email: email})
        .then((userDoc)=>{
            if(userDoc){
                req.flash('error', 'Email exists already, Please pick a different one.')
                return res.redirect('/signup')
            }
            const encryptedPassword = bcrypt.hash(password, 12);
            return encryptedPassword
                    .then((encryptedPassword)=>{
                        const user = new User({
                            email: email,
                            password: encryptedPassword,
                            cart: {items: []},
                        });
                        return user.save();
                    })
                    .then(result=>{
                        res.redirect('/login')
                        return transporter.sendMail({
                            to: 'isandeepsahoo5@gmail.com',
                            from:'shop@sandeep-application.com',
                            subject: 'Signup succeeded!',
                            html: '<h1>You successfully signed up!</h1>'
                        })
                        .catch(err=>{
                            //res.redirect('/500')
                            const error = new Error(err);
                            error.httpStatusCide = 500;
                            return next(error);
                          })
                        
                    })
        })
        .catch(err=>{
            //res.redirect('/500')
            const error = new Error(err);
            error.httpStatusCide = 500;
            return next(error);
          });

}
exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if(message.length>0){
        message = message[0]
    }else{
        message = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message,
        isAuthenticated: false,
    });
}
exports.postReset = (req, res, next)=>{
    crypto.randomBytes(32, (err, buffer)=>{
        if(err){
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email})
        .then(user=>{
            if(!user){
                req.flash('error', 'Email does not exist, please user another email')
                return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
        })
        .then(result=>{
            transporter.sendMail({
                to: req.body.email,
                from:'shop@sandeep-application.com',
                subject: 'Password reset',
                html: `
                    <p>You requested a password reset</p>
                    <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
                `
            });
            res.redirect('/');
        })
        .catch(err=>{
            //res.redirect('/500')
            const error = new Error(err);
            error.httpStatusCide = 500;
            return next(error);
          })
    })
}
exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
        .then(user=>{
            let message = req.flash('error');
            if(message.length>0){
                message = message[0]
            }else{
                message = null;
            }
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'Update Password',
                isAuthenticated: false,
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            });
        })
}
exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const token = req.body.passwordToken;
    let resetUser;
    User.findOne({
        resetToken: token,
        resetTokenExpiration: {$gt: Date.now()},
        _id: userId
    })
    .then(user=>{
        resetUser = user;
        return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword=>{
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
    })
    .then(result=>{
        res.redirect('/login');
    })
    .catch(err=>{
        //res.redirect('/500')
        const error = new Error(err);
        error.httpStatusCide = 500;
        return next(error);
      })
}