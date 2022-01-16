const { sequelize, Story, User, Post} = require('../models');
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

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, usr) => {
        if (err) return res.status(403).json({ msg: err })
        req.usr = usr;
    })
    next()
}

route.use(authToken)

route.get('/stories', (req, res) => {
    Story.findAll()
        .then( 
            rows => res.json(rows)
        )
        .catch( 
            err => res.status(500).json(err)
        ) 
})

route.get('/stories/:id', (req, res) => {
    Story.findOne({
        where: {
            id: req.params.id,
        },
    })
        .then( 
            rows => res.json(rows)
        )
        .catch( 
            err => res.status(500).json(err)
        ) 
})

route.get('/stories/users/:userID', (req, res) => {
    Story.findAll({
        where: {
            userID: req.params.userID,
        },
    })
        .then( 
            rows => res.json(rows)
        )
        .catch( 
            err => res.status(500).json(err)
        ) 
})

route.post('/stories', (req, res) => {
    Story.create({
        userID: req.body.username,
        data: req.body.data,
    })
        .then( 
            rows => res.json(rows)
        )
        .catch( 
            err => res.status(500).json(err)
        ) 
})

route.put('/stories/:id', async (req, res) => {
    try {
        let user = await User.findOne({
            where: {
                username: req.usr.username,
            }
        })
        let story = await Story.findOne({
            where: {
                id: req.params.id,
            }
        })

        if (!(user.dataValues.admin || (story.dataValues.userID === req.usr.username))) {
            return res.status(401).json({ msg:"not authorized" })
        }
    } catch (e) {
        res.status(500).json(err)
    }

    Story.findOne({
        where: {
            id: req.params.id,
        }
    })
        .then( 
            story => {
                story.data = req.body.data
                story.save()
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

route.delete('/stories/:id', async (req, res) => {
    try {
        let user = await User.findOne({
            where: {
                username: req.usr.username,
            }
        })
        let story = await Story.findOne({
            where: {
                id: req.params.id,
            }
        })

        if (!(user.dataValues.admin || (story.dataValues.userID === req.usr.username))) {
            return res.status(401).json({ msg:"not authorized" })
        }
    } catch (e) {
        res.status(500).json(err)
    }
    Story.findOne({
        where: {
            id: req.params.id
        }
    })
        .then( 
            story => {
                story.destroy()
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