const express = require('express');
const { getNowPlayingMovies } = require('../Controllers/tmdb.controller');

const router = express.Router();
router.get('/now-playing', getNowPlayingMovies);

module.exports = router;
