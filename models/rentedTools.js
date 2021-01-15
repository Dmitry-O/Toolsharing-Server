const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rentedToolSchema = new Schema({
    toolInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tool'
    },
    startDate: {
        type: mongoose.Schema.Types.Date   
    },
    expirationDate: {
        type: mongoose.Schema.Types.Date
    },
    numberOfUnits: {
        type: Number,
        min: 1,
        default: 1
    },
    numberOfDays: {
        type: Number,
        min: 1,
        default: 1
    },
    totalAmount: {
        type: Number,
        min: 0,
        default: 0
    }
},
{
    timestamps: true
})

const rentedToolsSchema = new Schema ({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rentedTools: [rentedToolSchema]
},
{
    timestamps: true
}
);

var RentedTools = mongoose.model('RentedTool', rentedToolsSchema);

module.exports = RentedTools;