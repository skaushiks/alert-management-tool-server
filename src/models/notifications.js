const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    pincode: String,
    fullName: String,
    contactNumber: String,
    address: String,
    city: String,
    timestamp: String,
    seen: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = mongoose.model('Notifications', notificationSchema);