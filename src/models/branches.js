const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    InstitutionName: {
        type: String,
        required: true,
        trim: true
    },
    BranchName: {
        type: String,
        required: true,
        trim: true
    },
    Address: {
        type: String,
        required: true,
        trim: true
    },
    City: {
        type: String,
        required: true,
        trim: true
    },
    ContactNumber: {
        type: Array,
        required: true
    },
    BranchIncharge: {
        type: String,
        required: true,
        trim: true
    },
    PincodeCovered: {
        type: Array,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model('Branches', branchSchema);