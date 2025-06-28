const mongoose = require('mongoose');

const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDb Connected");
        
    } catch (error) {
        console.log("Error in connecting to DB");
        
    }    
    
}

module.exports = connectDB;