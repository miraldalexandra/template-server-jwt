const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const {dbURI} = require("./config");

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
/*
// one way of mongoose connection with server listener together
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
 .then((result) => {
     app.listen(3000)
    })
 .catch((err) => console.log(err));
*/

// another way of mongoose connection
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
mongoose.set('useCreateIndex', true)
mongoose.connection.on("error", (err) => console.log(err))
mongoose.connection.on("open", () => console.log("database connected"))

// server listener
const port = 3000
app.listen(port, () => {
    console.log(`Server has been started on port: ${port}`)
})


// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/recipes', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);
