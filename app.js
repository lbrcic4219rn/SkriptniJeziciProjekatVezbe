const express = require("express");
const { sequelize } = require('./models');
const users = require('./routes/users');
const tags = require('./routes/tags')
const posts = require('./routes/posts')
const comments = require('./routes/comments')
const sotries = require('./routes/sories')
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

//routes
// app.use('/api', users);
// app.use('/api', tags);
// app.use('/api', posts);
// app.use('/api', comments);
// app.use('/api', sotries);

app.use(express.json());

const getCookies = (req) => {
    console.log("GETTING THEM COOKIES");
    if(req.headers.cookie == null) return null;

    const rawCookies = req.headers.cookie.spit('; ')
    const parsedCookeis  = {}

    rawCookies.forEach(element => {
        pc = element.split('=')
        parsedCookeis[pc[0]] = pc[1]
    });


}

const authToken = (req, res, next) => {
    console.log("attempted MIDLEWARE");
    const cookies = getCookies(req)
    //if(cookies === null) return res.redirect(301, '/login')
    const token = cookies['token']

    //if(token === null) return res.redirect(301, '/login')
    
    // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, usr) => {
    //     if (err) return res.redirect(301, '/login')

    //     req.usr = usr;

       
    // }) 
    next()
}

app.get('/register', (req, res) => {
    res.sendFile("register.html", { root: './static' });  
})

app.get('/login', (req, res) => {
    res.sendFile("login.html", { root: './static' });  
})

app.get('/', (req, res) => {
    res.sendFile("index.html", { root: './static' });  
})

app.use(express.static(path.join(__dirname, 'static')));

app.listen({ port: 8000 }, async () => {
    await sequelize.authenticate();
});
