const router = require("express").Router();
const express = require("express");

const notification = require("../controllers/NotificationController");
const { isAuthenticated } = require("../controllers/auth.controller");

router.post("/add-notification", isAuthenticated, notification.UserSettings);
router.get("/get", isAuthenticated, notification.getAllnotifications);
router.post("/send", isAuthenticated, notification.sendNotification);

module.exports = router;
