const express = require("express");
const { sequelize } = require('./models');
const users = require('./routes/users');
const tags = require('./routes/tags')
const posts = require('./routes/posts')
const comments = require('./routes/comments')
const sotries = require('./routes/sories')
const path = require('path');
const bp = require('body-parser');

const app = express();

//routes
app.use('/api', users);
app.use('/api', tags);
app.use('/api', posts);
app.use('/api', comments);
app.use('/api', sotries);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'static')));
app.use(bp.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.sendFile("index.html");  
})

//GETOVANJE PARAMETARA IZ RUTE KOJI MOGU BITI POMENLJIVI
app.get('/testRuta/:kategorija/:ime', (req, res) => {
    res.send(`TestRuta ${req.params.kategorija} ${req.params.ime}`);  
})

//QUEY PARAMS
app.get('/testRuta', (req, res) => {
    res.send(`TestRuta ${req.query.kategorija} ${req.query.ime}`);  
})

app.post('/post', (req, res) => {
    console.log(req.body);
    res.send(`TestRuta ${req.body}`);  
})
app.listen({ port: 8000 }, async () => {
    await sequelize.authenticate();
});
