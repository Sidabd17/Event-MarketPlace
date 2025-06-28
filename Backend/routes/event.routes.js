const express = require('express');
const router = express.Router();

const { createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  joinEvent,
  getMyEvents,
  getUserSavedEvents,
  toggleSavedEvent, } = require('../Controllers/event.controller');
const isAuthenticated = require('../middlewares/authmiddleware');   
const singleUpload = require('../middlewares/multer');

router.route("/create").post(isAuthenticated, singleUpload, createEvent);
router.route("/").get(getAllEvents);
router.route("/my-events").get(isAuthenticated, getMyEvents);
router.route("/saved-events").get(isAuthenticated, getUserSavedEvents);

router.route("/:id").get(getEventById);
router.route("/update/:id").put(isAuthenticated, singleUpload, updateEvent);
router.route("/delete/:id").delete(isAuthenticated, deleteEvent);
router.route("/join/:id").put(isAuthenticated, joinEvent);
router.route("/toggle/:id").patch(isAuthenticated, toggleSavedEvent);

module.exports = router;

