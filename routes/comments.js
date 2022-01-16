const { sequelize, Comment, User } = require('../models');
const express = require('express');
const jwt = require("jsonwebtoken");

const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({ extended: true }))

function authToken(req, res, next){

    const authHeader = req.headers['authorization']
    if(authHeader == undefined) return res.status(401).json({ msg:"not authorized" })
    const token = authHeader && authHeader.split(' ')[1]


    if(token === null) return res.status(401).json({ msg:"not authorized" })

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,  (err, usr)  => {
        if (err) return res.status(403).json({ msg: err })
        req.usr = usr;
    })
    next()
}

route.use(authToken)

route.get('/comments', (req, res) => {
    Comment.findAll()
        .then( 
            rows => res.json(rows)
        )
        .catch( 
            err => res.status(500).json(err)
        ) 
})

route.get('/users/:id', (req, res) => {
    Comment.findOne({
        where: {
            id: req.params.id,
        }
    })
        .then( 
            rows => res.json(rows)
        )
        .catch( 
            err => res.status(500).json(err)
        ) 
})


route.get('/comments/posts/:postID', (req, res) => {


    Comment.findAll({
        where: {
            postID: req.params.postID,
        },
    })
        .then( 
            rows => res.json(rows)
        )
        .catch( 
            err => res.status(500).json(err)
        ) 
})

route.post('/comments', (req, res) => {
    Comment.create({
        userID: req.body.userID,
        postID: req.body.postID,
        data: req.body.data,
    })
        .then( 
            rows => res.json(rows)
        )
        .catch( 
            err => res.status(500).json(err)
        ) 
})

route.put('/comments/:id', async (req, res) => {
    try {
        let user = await User.findOne({wehere: {username: req.usr.username}})
        let comment = await Comment.findOne({
            where: {
                id: req.params.id,
            }
        })
        console.log("is admin", user.dataValues)
        console.log("is owner", comment.dataValues.userID === req.usr.username)
        console.log(comment.dataValues.userID, req.usr.username)
        if (!(user.dataValues.admin && (comment.dataValues.userID === req.usr.username))) {
            return res.status(401).json({ msg:"not authorized" })
        }
    } catch (e) {
        res.status(500).json(err)
    }
    Comment.findOne({
        where: {
            id: req.params.id,
        }
    })
        .then( 
            comment => {
                comment.data = req.body.data
                comment.save()
                    .then( 
                        rows => res.json(rows)
                    )
                    .catch(
                        err => res.status(500).json(err)
                    )
                
            }
        )
        .catch( 
            err => res.status(500).json(err)
        ) 
})

route.delete('/comments/:id', (req, res) => {
    Comment.findOne({
        where: {
            id: req.params.id
        }
    })
        .then( 
            comment => {
                comment.destroy()
                    .then(
                        rows => res.json(rows)
                    )
                    .catch(
                        err => res.status(500).json(err)
                    )
            }
        )
        .catch( 
            err => res.status(500).json(err)
        ) 
})

module.exports = route;