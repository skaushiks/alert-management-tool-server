const Branches = require('../models/branches');
const Notifications = require('../models/notifications');

exports.userBranches = async (req, res) => {
    try {
        const branches = await Branches.find({ PincodeCovered: req.body.pincode }).exec();

        if (branches) {
            res.status(200).json({ branches });
        } else {
            res.status(404).json({ errorMessage: 'Not Found!' });
        }
    } catch (error) {
        res.status(500).json({ errorMessage: 'Internal Server Error.' })
    }
};

exports.addNewNotification = (req, res) => {
    const body = req.body;

    Notifications.create(body, (error, data) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(201).send(data);
        }
    });
};

exports.getAllNotifications = (req, res) => {
    Notifications.find((error, data) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).send(data);
        }
    });
};