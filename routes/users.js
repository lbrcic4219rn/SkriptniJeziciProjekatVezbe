const { sequelize, User } = require('../models');
const express = require('express');

const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({ extended: true }))

route.get('/users', (req, res) => {
    User.findAll()
        .then( 
            rows => res.json(rows)
        )
        .catch( 
            err => res.status(500).json(err)
        ) 
})

route.get('/users/:username', (req, res) => {
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

route.post('/users', (req, res) => {
    User.create({
        username: req.body.username,
        bio: req.body.bio,
        profilePicture: req.body.profilePicture,
    })
        .then( 
            rows => res.json(rows)
        )
        .catch( 
            err => res.status(500).json(err)
        ) 
})

route.put('/users/:username', (req, res) => {
    User.findOne({
        where: {
            username: req.params.username,
        }
    })
        .then( 
            usr => {
                usr.username = req.body.username
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

route.delete('/users/:username', (req, res) => {
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