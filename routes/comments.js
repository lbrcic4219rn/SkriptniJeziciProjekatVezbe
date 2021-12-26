const { sequelize, Comment } = require('../models');
const express = require('express');

const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({ extended: true }))

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

route.put('/comments/:id', (req, res) => {
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