const express = require('express');
const { userBranches, addNewNotification, getAllNotifications, updateNotification, getBranchNotifications } = require('../controllers/user');

const router = express.Router();

router.post('/user/branches', userBranches);

router.post('/add/notification', addNewNotification);

router.get('/get/notifications', getAllNotifications);

router.post('/branch/notifications', getBranchNotifications);

router.put('/update/notification/:id', updateNotification);

module.exports = router;