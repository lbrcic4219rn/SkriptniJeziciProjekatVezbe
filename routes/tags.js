const { sequelize, Post,  Post_Tag} = require('../models');

const express = require('express');

const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({ extended: true }))

route.get('/tags/posts/:tagName', async (req, res) => {
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