const { sequelize, Comment, User } = require('../models');

const express = require('express');
const jwt = require("jsonwebtoken");
const joi = require("joi");

const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({ extended: true }))

function authToken(req, res, next){
    if(req.method == "GET"){
        next()
        return
    }
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

route.get('/comments/:id', (req, res) => {
    const schema = joi.object({
        id: joi.number().min(1).required()
    })
    const {error, value} = schema.validate({id: req.params.id})
    if(error)
        res.status(400).json(error)
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
    //Input validation
    const schema = joi.object({
        id: joi.number().min(1).required()
    })
    const {error, value} = schema.validate({id: req.params.postID})
    if(error)
        res.status(400).json(error)

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

route.post('/comments', async (req, res) => {
    //Input validation
    const schema = joi.object({
        userID: joi.string().required(),
        postID: joi.number().min(1).required(),
        data: joi.string().required(),
    })
    const {error, value} = schema.validate({
        userID: req.usr.username,
        postID: req.body.postID,
        data: req.body.data
    })
    if(error)
        res.status(400).json(error)

    Comment.create({
        userID: req.usr.username,
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
    const schema = joi.object({
        id: joi.number().min(1).required(),
        userID: joi.string().required(),
        data: joi.string().required(),
    })
    const {error, value} = schema.validate({
        id: req.params.id,
        userID: req.usr.username,
        data: req.body.data
    })
    if(error)
        res.status(400).json(error)
    try {
        let user = await User.findOne({
            where: {
                username: req.usr.username,
            }
        })
        let comment = await Comment.findOne({
            where: {
                id: req.params.id,
            }
        })

        if (!(user.dataValues.admin || (comment.dataValues.userID === req.usr.username))) {
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

route.delete('/comments/:id', async (req, res) => {
    const schema = joi.object({
        id: joi.number().min(1).required(),
    })
    const {error, value} = schema.validate({
        id: req.params.id,
    })
    if(error)
        res.status(400).json(error)
    try {
        let user = await User.findOne({
            where: {
                username: req.usr.username,
            }
        })
        let comment = await Comment.findOne({
            where: {
                id: req.params.id,
            }
        })

        if (!(user.dataValues.admin || (comment.dataValues.userID === req.usr.username))) {
            return res.status(401).json({ msg:"not authorized" })
        }
    } catch (e) {
        res.status(500).json(err)
    }
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