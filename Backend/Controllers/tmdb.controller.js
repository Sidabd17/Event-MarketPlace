const axios = require("axios");

const getNowPlayingMovies = async (req, res) => {
  try {
    const tmdbRes = await axios.get("https://api.themoviedb.org/3/movie/now_playing", {
      params: {
        api_key: process.env.TMDB_API_KEY, // secure with env variable later
        language: "en-US",
        region: "IN",
        page: 1,
      },
      timeout: 8000,
    });

    return res.json(tmdbRes.data); // ✅ Now it works
  } catch (err) {
    console.error("TMDB fetch error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to fetch TMDB data" });
  }
};

module.exports = { getNowPlayingMovies };
