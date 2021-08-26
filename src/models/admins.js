const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'administrator'
    }

}, { timestamps: true });

adminSchema.methods = {
    authenticate: async function (password) {
        return await bcrypt.compare(password, this.password)
    }
};

module.exports = mongoose.model('Admins', adminSchema);