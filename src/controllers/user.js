const Branches = require('../models/branches');
const Notifications = require('../models/notifications');

exports.userBranches = async (req, res) => {
    try {
        const branches = await Branches.find({ PincodeCovered: req.body.pincode }).exec();

        if (branches) {
            res.status(200).json({ branches });
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
    Notifications.find({})
        .sort({ createdAt: -1 })
        .exec((error, data) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send(data);
            }
        });
};

exports.getBranchNotifications = (req, res) => {
    Notifications.find({ pincode: req.body })
        .sort({ createdAt: -1 })
        .exec((error, data) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send(data);
            }
        });
};

exports.updateNotification = (req, res) => {
    Notifications.findOneAndUpdate(
        { _id: req.params.id },
        { seen: true }
    ).exec((error, data) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).send(data);
        }
    });
};