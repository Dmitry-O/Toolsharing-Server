const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');
const authenticate = require('../authenticate');

const Tools = require('../models/tools');

const toolRouter = express.Router();

toolRouter.use(bodyParser.json());

toolRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, (req, res, next) => {
    Tools.find(req.query)
    //.populate('comments.author')
    .then((tools) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(tools);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Tools.create(req.body)
    .then((tool) => {
        console.log('Dish created: ', tool);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(tool);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation not supported on /tools');
})
.delete(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Tools.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

toolRouter.route('/:toolId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, (req, res, next) => {
    Tools.findById(req.params.toolId)
    .populate('comments.author')
    .then((tools) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(tools);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /tools/' + req.params.toolId);
})
.put(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Tools.findByIdAndUpdate(req.params.toolId, {$set: req.body}, {new: true})
    .then((tool) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(tool);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Tools.findByIdAndRemove(req.params.toolId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = toolRouter;