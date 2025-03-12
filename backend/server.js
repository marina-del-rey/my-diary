const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();

// read .env file
require("dotenv").config();
const { MONGO_URL, PORT } = process.env;

app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin: ["http://localhost:4000", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}
app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// api routes
require("./routes/auth.route")(app);
require("./routes/diary.route")(app);
require("./routes/user.route")(app);
require("./routes/search.route")(app);

app.get("/", (req, res) => {
    res.json({ message: "Api is up and running!" });
});

mongoose
    .connect(MONGO_URL)
    .then(() => {
        console.log("Sucessfully conntected to database!");
    })
    .catch(err => {
        console.log("Error connecting to database!", err);
        process.exit();
    });


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});