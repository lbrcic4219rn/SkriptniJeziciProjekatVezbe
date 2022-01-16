const { sequelize, Post, Tag, Post_Tag, User, Comment} = require('../models');
const express = require('express');
const post_tag = require('../models/post_tag');
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

route.get('/posts', (req, res) => {
    Post.findAll()
        .then( 
            rows => res.json(rows)
        )
        .catch( 
            err => res.status(500).json(err)
        ) 
})

route.get('/posts/:id', (req, res) => {
    Post.findOne({
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

route.get('/posts/users/:username', (req, res) => {
    Post.findAll({
        where: {
            userID: req.params.username,
        },
    })
        .then( 
            rows => res.json(rows)
        )
        .catch( 
            err => res.status(500).json(err)
        ) 
})

route.post('/posts', async (req, res) => {
    try{
        //Pravljenje tagova u koliko ne postoje
        const tags = req.body.tags;
        const newTags = [];
        for( let tag of tags){
            let foundTag = await Tag.findOne({
                where: {
                    tagName: tag
                }
            })
            if(foundTag === null){
                 foundTag = await Tag.create({
                    tagName: tag
                })
            }
            newTags.push(foundTag)
        }

        //kreiranje novog Posta
        newPost = await Post.create({
            userID: req.body.userID,
            data: req.body.data,
            likeCount: 0,
            image: req.body.image
        })

        //Dodavanje u medju tabelu postova i tagova 
        for(let tag of newTags){
            console.log( "TAG", tag.dataValues.tagName);
            await Post_Tag.create({
                postID: newPost.dataValues.id,
                tagName: tag.dataValues.tagName,
            })
        }
        res.json(newPost)
    }
    catch (err) { 
        console.log("error", err)
        res.status(500).json(err)
    }
})

route.put('/posts/:id', async (req, res) => {
    try{
        let user = await User.findOne({
            where: {
                username: req.usr.username,
            }
        })

        //getujemo post
        const oldPost = await Post.findOne({
            where: {
                id: req.params.id,
            }
        })

        if (!(user.dataValues.admin || (oldPost.dataValues.userID === req.usr.username))) {
            return res.status(401).json({ msg:"not authorized" })
        }



        //getujemo sve tagove koje imamo sacuvane u tablei sa postovima i tagovima  
        let oldTags = await Post_Tag.findAll({
            where: {
                postID: req.params.id
            }
        })
        oldTags = oldTags.map( (el) => {
            return el.dataValues.tagName
        })
        
        //brisanje starih veza
        const newTags = req.body.tags;
        for(let tag of oldTags) {
            const postTag = await Post_Tag.findOne({
                where: {
                    postID: req.params.id,
                    tagName: tag
                }
            })
            await postTag.destroy()
        }
        //Dodavanje novih veza
        for( let tag of newTags){
            let foundTag = await Tag.findOne({
                where: {
                    tagName: tag
                }
            })
            if(foundTag === null){
                 foundTag = await Tag.create({
                    tagName: tag
                })
            }
            await Post_Tag.create({
                postID: req.params.id,
                tagName: tag,
            })
        }

        oldPost.data = req.body.data
        oldPost.image = req.body.image
        
        savedPost = await oldPost.save()

        res.json(savedPost)
    }
    catch (err) { 
        console.log("error", err)
        res.status(500).json(err)
    }

    
        
})

route.delete('/posts/:id', async (req, res) => {
    try {
        let user = await User.findOne({
            where: {
                username: req.usr.username,
            }
        })
        let post = await Post.findOne({
            where: {
                id: req.params.id,
            }
        })

        if (!(user.dataValues.admin || (post.dataValues.userID === req.usr.username))) {
            return res.status(401).json({ msg:"not authorized" })
        }
    } catch (e) {
        res.status(500).json(err)
    }

    Post.findOne({
        where: {
            id: req.params.id
        }
    })
        .then( 
            post => {
                post.destroy()
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