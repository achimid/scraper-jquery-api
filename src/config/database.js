const mongoose = require("mongoose");

module.exports = () => {
    mongoose.connect(process.env.MONGO_DB_CONNECTION, {
        useNewUrlParser: true,
    });
    
    const db = mongoose.connection;
    
    db.on("error", () => {
        console.log("Error occurred from the database");
    });
    db.once("open", () => {
        console.log("Database successfully connected");
    });
}
