const { sequelize, Story } = require('../models');
const express = require('express');

const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({ extended: true }))

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

route.put('/stories/:id', (req, res) => {
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

route.delete('/stories/:id', (req, res) => {
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