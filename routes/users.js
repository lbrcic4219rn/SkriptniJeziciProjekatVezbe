const { sequelize, User, Comment} = require('../models');
const express = require('express');
const jwt = require('jsonwebtoken');
const joi = require("joi");
require('dotenv').config();

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

route.get('/users', (req, res) => {
    User.findAll()
        .then(
            rows => {
                rows = rows.map(el => {
                    const {password, ...newObj} = el.dataValues
                    return newObj;
                })
                res.json(rows)
            }
        )
        .catch( 
            err => res.status(500).json(err)
        ) 
})

route.get('/users/:username', (req, res) => {
    const schema = joi.object({
        username: joi.string().required(),
    })
    const {error, value} = schema.validate({
        username: req.params.username,
    })
    if(error)
        res.status(400).json(error)
    User.findOne({
        where: {
            username: req.params.username,
        }
    })
        .then( 
            rows => res.json(rows)
        )
        .catch( 
            err => res.status(500).json(err)
        ) 
})

route.put('/users/:username', async (req, res) => {
    const schema = joi.object({
        username: joi.string().required(),
        bio: joi.string().required(),
        profilePicture: joi.string().required()
    })
    const {error, value} = schema.validate({
        username: req.usr.username,
        bio: req.body.bio,
        profilePicture: req.body.profilePicture,

    })
    if(error)
        res.status(400).json(error)
    try {
        let user = await User.findOne({
            where: {
                username: req.usr.username,
            }
        })
        if (!(user.dataValues.admin || (req.params.username === req.usr.username))) {
            return res.status(401).json({ msg:"not authorized" })
        }
    } catch (e) {
        res.status(500).json(err)
    }
    User.findOne({
        where: {
            username: req.params.username,
        }
    })
        .then( 
            usr => {
                usr.bio = req.body.bio
                usr.profilePicture = req.body.profilePicture
                usr.save()
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

route.delete('/users/:username', async (req, res) => {
    const schema = joi.object({
        username: joi.string().required(),
    })
    const {error, value} = schema.validate({
        username: req.params.username,
    })
    try {
        let user = await User.findOne({
            where: {
                username: req.usr.username,
            }
        })
        if (!(user.dataValues.admin || (req.params.username === req.usr.username))) {
            return res.status(401).json({ msg:"not authorized" })
        }
    } catch (e) {
        res.status(500).json(err)
    }
    User.findOne({
        where: {
            username: req.params.username
        }
    })
        .then( 
            usr => {
                usr.destroy()
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