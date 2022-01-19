const { sequelize, Post,  Post_Tag} = require('../models');

const express = require('express');
const jwt = require("jsonwebtoken");
const joi = require("joi");

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

route.get('/tags/posts/:tagName', async (req, res) => {
    const schema = joi.object({
        tagName: joi.string().required(),
    })
    const {error, value} = schema.validate({
        tagName: req.params.tagName
    })
    if(error)
        res.status(400).json(error)
    try {
        let posts = await Post_Tag.findAll({
            where: {
                tagName: req.params.tagName
            }
        })

        posts = posts.map( el => {
            return el.postID;
        })
        
        posts = await Post.findAll({
            where: {
                id: posts
            }
        })

        res.json(posts)
    } catch (err) {
        res.status(500).json(err)
    }

})

module.exports = route;