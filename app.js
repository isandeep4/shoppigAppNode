const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const user = require('./models/user');
const User = require('./models/user');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById("65511508f986df69995597c6")
        .then(user=>{
            req.user = user;
            next();
        })
        .catch(err=>console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

mongoose
.connect("mongodb+srv://isandeep:Sandy12345@cluster0.na7q6xf.mongodb.net/shop?retryWrites=true&w=majority")
    .then(()=>{
        User.findOne().then((user)=>{
            if(!user){
                const user = new User({
                    name: 'Sandy',
                    email: 'sandy@gmail.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        })
        app.listen(3000, ()=>console.log('connected'))
    })
    .catch(err=>console.log(err));

