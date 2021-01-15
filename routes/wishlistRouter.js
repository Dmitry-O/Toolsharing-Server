const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Wishlist = require('../models/wishlist');
const { populate } = require('../models/wishlist');

const whishlistRouter = express.Router();

whishlistRouter.use(bodyParser.json());

whishlistRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Wishlist.findOne({user: req.user._id})
    .populate('user')
    .populate('tools')
    .then((wishlists) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(wishlists);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Wishlist.findOne({user: req.user._id})
    .then((wishlist) => {
        if (wishlist) {
            for (var i = 0; i < req.body.length; i++)
                if (wishlist.tools.indexOf(req.body[i]._id) === -1)
                    wishlist.tools.push(req.body[i]._id);
            wishlist.save()
            .then((wishlist) => {
                Wishlist.findById(wishlist._id)
                .populate('user')
                .populate('tools')
                .then((wishlist) => {
                    console.log('Wishlist created: ', wishlist);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(wishlist);
                })
            })
            .catch((err) => {
                return next(err);
            });
        }
        else {
            for (var i = 0; i < req.body.length; i++)
                if (wishlist.tools,indexOf(req.body[i]._id))
                    wishlist.tools.push(req.body[i]);
            wishlist.save()
            //Favorites.create({"user": req.user._id, "dishes": req.body})
            .then((wishlist) => {
                Wishlist.findById(wishlist._id)
                .populate('user')
                .populate('tools')
                .then((wishlist) => {
                    console.log('Wishlist created: ', wishlist);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(wishlist);
                })
            })
            .catch((err) => {
                return next(err);
            });
        }
    });
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /wishlist');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Wishlist.findOneAndRemove({"user": req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

whishlistRouter.route('/:toolId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Wishlist.findOne({user: req.user._id})
    .then((wishlists) => {
        if (!wishlists) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "wishlists": wishlists});
        }
        else {
            if (wishlists.tools.indexOf(req.params.toolId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "wishlists": wishlists}); 
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "wishlists": wishlists});
            }
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Wishlist.findOne({user: req.user._id})
    .then((wishlist) => {
        if (wishlist) {            
            if (wishlist.tools.indexOf(req.params.toolId) === -1) {
                wishlist.tools.push(req.params.toolId)
                wishlist.save()
                .then((wishlist) => {
                    Wishlist.findById(wishlist._id)
                    .populate('user')
                    .populate('tools')
                    .then((wishlist) => {
                        console.log('Wishlist created: ', wishlist);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(wishlist);
                    })
                }, (err) => next(err))
            }
        }
        else {
            Wishlist.create({"user": req.user._id, "tools": [req.params.toolId]})
            .then((wishlist) => {
                Wishlist.findById(wishlist._id)
                .populate('user')
                .populate('tools')
                .then((wishlist) => {
                    console.log('Wishlist created: ', wishlist);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(wishlist);
                })
            }, (err) => next(err))
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /wishlist/' + req.params.toolId);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Wishlist.findOne({user: req.user._id})
    .then((wishlist) => {
        if (wishlist) {            
            if (wishlist.tools.indexOf(req.params.toolId) >= 0) {
                var index = wishlist.tools.indexOf(req.params.toolId);
                wishlist.tools.splice(index, 1);
                wishlist.save()
                .then((wishlist) => {
                    Wishlist.findById(wishlist._id)
                    .populate('user')
                    .populate('tools')
                    .then((wishlist) => {
                        console.log('Wishlist created: ', wishlist);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(wishlist);
                    })
                }, (err) => next(err));
            }
            else {
                err = new Error('Tool ' + req.params.toolId + ' not found');
                err.status = 404;
                return next(err);
            }
        }
        else {
            err = new Error('Wishlist not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = whishlistRouter;