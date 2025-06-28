const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
// const app = express();
const userRoutes = require("./routes/user.routes");
const eventRoutes = require("./routes/event.routes");
const ticketRoutes = require("./routes/ticket.routes");
const movieRoutes = require("./routes/movie.routes");
const tmdbRoutes = require("./routes/tmdb.routes");
const notificationRoutes = require("./routes/notification.routes");
const otpRoutes = require("./routes/otp.routes");

const {app , server} = require('./Socket');


const connectDB = require('./utils/db');

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const corsOptions = {
    origin: "http://localhost:5173",
    credentials:true
}
app.use(cors(corsOptions));


app.use("/api/v1/user" ,userRoutes);
app.use("/api/v1/event" ,eventRoutes);
app.use("/api/v1/ticket" ,ticketRoutes);
app.use("/api/v1/movie" ,movieRoutes);
app.use("/api/v1/tmdb" ,tmdbRoutes);
app.use("/api/v1/notification" ,notificationRoutes);
app.use('/api/v1/otp' , otpRoutes)

require("./cron/reminderJob");

const PORT = process.env.PORT || 3000;
server.listen(PORT ,()=>{
    connectDB();
    console.log(`Server is listening at port ${PORT}`)
})
