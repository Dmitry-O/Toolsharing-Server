const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const RentedTools = require('../models/rentedTools');
const { populate } = require('../models/rentedTools');

const rentedToolRouter = express.Router();

rentedToolRouter.use(bodyParser.json());

rentedToolRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    RentedTools.findOne({user: req.user._id})
    .populate('user')
    .populate('rentedTools.toolInfo')
    .then((rentedTools) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(rentedTools);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    RentedTools.findOne({user: req.user._id})
    .then((rentedTool) => {
        if (rentedTool) {           
            //console.log("Rented tool:", rentedTool.rentedTools[4]); 
            //if (rentedTool.rentedTools.toolInfo.indexOf(req.body.toolInfo) === -1) {
                rentedTool.rentedTools.push(req.body)
                rentedTool.save()
                .then((rentedTool) => {
                    RentedTools.findById(rentedTool._id)
                    .populate('user')
                    .populate('rentedTools.toolInfo')
                    .then((rentedTool) => {
                        console.log('RentedTools created: ', rentedTool);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(rentedTool);
                    })
                }, (err) => next(err))
            //}
        }
        else {
            RentedTools.create({"user": req.user._id, "rentedTools": req.body})
            .then((rentedTool) => {
                //console.log("Tool info id: ", req.body.toolInfo);
                //rentedTool.rentedTools.toolInfo.push(req.params.toolId)
                //rentedTool.save();
                RentedTools.findById(rentedTool._id)
                .populate('user')
                .populate('rentedTools.toolInfo')
                .then((rentedTool) => {
                    console.log('RentedTools created: ', rentedTool);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(rentedTool);
                })
            }, (err) => next(err))
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /rentedTool');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    RentedTools.findOneAndRemove({"user": req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

/*rentedToolRouter.route('/:toolId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    RentedTools.findOne({user: req.user._id})
    .then((rentedTools) => {
        if (!rentedTools) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "rentedTools": rentedTools});
        }
        else {
            let temp = rentedTools.rentedTools;
            //console.log('temp: ', temp[0].toolInfo);
            let exst = false;
            for (let i = 0; i < temp.length; i++)
                if (temp[i].toolInfo === req.params.toolId)
                    exst = true;
            if (!exst) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "rentedTools": rentedTools}); 
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "rentedTools": rentedTools});
            }
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

/*.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /rentedTool/' + req.params.toolId);
})
/*.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    RentedTools.findOne({user: req.user._id})
    .then((rentedTool) => {
        if (rentedTool) {            
            if (rentedTool.rentedTools.toolInfo.indexOf(req.params.toolId) >= 0) {
                var index = rentedTool.rentedTools.toolInfo.indexOf(req.params.toolId);
                rentedTool.rentedTools.toolInfo.splice(index, 1);
                rentedTool.save()
                .then((rentedTool) => {
                    RentedTools.findById(rentedTool._id)
                    .populate('user')
                    .populate('rentedTools.toolInfo')
                    .then((rentedTool) => {
                        console.log('RentedTools created: ', rentedTool);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(rentedTool);
                    })
                }, (err) => next(err));
            }
            else {
                err = new Error('RedntedTool ' + req.params.toolId + ' not found');
                err.status = 404;
                return next(err);
            }
        }
        else {
            err = new Error('RentedTools not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});*/

module.exports = rentedToolRouter;