const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const branchSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'incharge'
    },
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

branchSchema.methods = {
    authenticate: async function (password) {
        return await bcrypt.compare(password, this.password)
    }
};

module.exports = mongoose.model('Branches', branchSchema);