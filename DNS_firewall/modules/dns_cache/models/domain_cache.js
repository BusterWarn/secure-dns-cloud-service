// External Dependancies
const mongoose = require('mongoose');
const boom = require('boom');

const cache = mongoose.model('domainCache', new mongoose.Schema({
    _id: String,
    ip: String,
    expire: Number,
}));

// Get all cars
exports.getDomains = async (req, reply) => {
    try {
        return await cache.find({});
    } catch (err) {
        throw boom.boomify(err)
    }
}

// Get single car by ID
exports.getIpByDomain = async (req, reply) => {
    try {
        console.log(req);
        const doc = await cache.find({ _id: req });
        console.log(doc);
        if (doc[0] && doc[0].expire > Date.now())
            return doc
        else
            return [];
    } catch (err) {
        throw boom.boomify(err)
    }
}

// Add a new car
exports.addIp = async (req, reply) => {
    try {
        let doc = await cache.find({_id: req._id })
        if (doc.length !== 0) {
            doc[0].ip = req.ip;
            doc[0].expire = req.expire;
            return await doc[0].save();
        } else {
            return await cache.create(req);
        }
        
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.truncate = async(req, reply) => {
    try {
        return await cache.deleteMany({});
        
    } catch (err) {
        throw boom.boomify(err)
    }
}