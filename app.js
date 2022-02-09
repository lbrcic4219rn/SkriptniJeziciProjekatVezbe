const express = require("express");
const { sequelize } = require('./models');
const users = require('./routes/users');
const tags = require('./routes/tags')
const posts = require('./routes/posts')
const comments = require('./routes/comments')
const sotries = require('./routes/sories')
const path = require('path');
const jwt = require('jsonwebtoken');
const cors = require('cors');

require('dotenv').config();

const app = express();

const corsOptions = {
    origin: 'http://localhost:8080',
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions));
//routes
app.use('/api', users);
app.use('/api', tags);
app.use('/api', posts);
app.use('/api', comments);
app.use('/api', sotries);

app.use(express.json());


function getCookies(req){
    if(req.headers.cookie == null) return {};

    const rawCookies = req.headers.cookie.split('; ')
    const parsedCookeis  = {}

    rawCookies.forEach(element => {

        pc = element.split('=')
        parsedCookeis[pc[0]] = pc[1]
    });

    return parsedCookeis

}

function authToken(req, res, next){
    const cookies = getCookies(req)
    const token = cookies['token']

    if(token === null) return res.redirect(301, '/login')
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, usr) => {
        if (err) return res.redirect(301, '/login')
        req.usr = usr;
    })
    next()
}

app.get('/register', (req, res) => {
    res.sendFile("register.html", { root: './static' });  
})

app.get('/login', (req, res) => {
    res.sendFile("login.html", { root: './static' });  
})

app.get('/', authToken, (req, res) => {
    res.sendFile("index.html", { root: './static' });
})

app.get('/index.html', authToken, (req, res) => {
    res.sendFile("index.html", { root: './static' });
})

app.use(express.static(path.join(__dirname, 'static')));

app.listen({ port: 8000 }, async () => {
    await sequelize.authenticate();
});
