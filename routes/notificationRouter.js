const router = require("express").Router();
const express = require("express");

const notification = require("../controllers/notificationControllers");
const { isAuthenticated } = require("../controllers/auth.controller");

router.post("/add-notification", isAuthenticated, notification.AddNotification);
router.get("/get", isAuthenticated, notification.getNotification);
// router.post("/send", isAuthenticated, notification.AddNotification);

module.exports = router;
