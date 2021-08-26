const express = require('express');
const { userBranches, addNewNotification, getAllNotifications } = require('../controllers/user');

const router = express.Router();

router.post('/user/branches', userBranches);

router.post('/add/notification', addNewNotification);

router.get('/get/notifications', getAllNotifications);

module.exports = router;