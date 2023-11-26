const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');

const errorController = require('./controllers/error');

const MONGODB_URI = "mongodb+srv://isandeep:Sandy12345@cluster0.na7q6xf.mongodb.net/shop?retryWrites=true&w=majority";

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collections: 'session'
})

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const User = require('./models/user');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}));
app.use(flash())

app.use((req, res, next)=>{
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
        .then(user=>{
            req.user = user;
            next();
        })
        .catch(err=>console.log(err))        
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);



mongoose
.connect(MONGODB_URI)
    .then(()=>{
        app.listen(3000, ()=>console.log('connected'))
    })
    .catch(err=>console.log(err));

