// test.js
const axios = require("axios");

(async () => {
  try {
    const res = await axios.get("https://api.themoviedb.org/3/movie/now_playing", {
      params: {
        api_key: "6e1b15335f29c482775ee2fdad579c66", // Or process.env.TMDB_API_KEY
        language: "en-US",
        region: "IN",
        page: 1
      },
      timeout: 8000, // 8 sec timeout
    });

    console.log("✅ Success:", res.data.results.length, "movies loaded");
  } catch (err) {
    console.error("❌ Error:", err.code || err.message);
  }
})();
